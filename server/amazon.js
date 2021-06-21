const pupept = require ('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const prompt = require('prompt-sync')();

const filterObjectArray = require('filter-object-array');

//sleep
const sleep = require ('sleep');

const fs = require('fs');
const { isNullOrUndefined } = require('util');
const { exit } = require('process');
const { time } = require('console');
const path = './config.json'
const NtFolwngU = './NotFollowings.json'
const TargetFollowings = './TargetFollowings.json'


//update json file
function jsonReader(filePath, cb) {
    fs.readFile(filePath, (err, fileData) => {
      if (err) {
        return cb && cb(err);
      }
      try {
        const object = JSON.parse(fileData);
        return cb && cb(null, object);
      } catch (err) {
        return cb && cb(err);
      }
    });
  }

//scrape amazon
async function ScrapeAmazon (url){
    const browser = await pupept.launch({
      headless: false,
      ignoreHTTPSErrors: true,
      defaultViewport: {
        width: 375,
        height: 812,
        isMobile: true}
    });
    try{
    const page = await browser.newPage();
    // await page.emulate(iPhone);
    await page.bringToFront();

    //set cookies if available
    //await page.setCookie.apply(page, cookies);
    await page.goto(url);
    //*[@id="landingImage"]
    const [el] = await page.$x('//*[@id="landingImage"]');
    const src = await el.getProperty('src');
    const srcTxt = await src.jsonValue();
   
    const [el1] = await page.$x('//*[@id="productTitle"]');
    const src1 = await el1.getProperty('textContent');
    //console.log(src1)
    const srcTxt1 = await src1.jsonValue();
    const title = srcTxt1.replace(/(\r\n|\n|\r)/gm, "");

    //*[@id="price_inside_buybox"]
    const [el2] = await page.$x('//*[@id="price_inside_buybox"]');
    const src2 = await el2.getProperty('textContent');
    const srcTxt2 = await src2.jsonValue();
    console.log(srcTxt2)
    const price = srcTxt2.replace(/(\r\n|\n|\r)/gm, "");

    console.log({srcTxt, title, price});
    }
    catch (err){
        console.log(err);
    }
      

    browser.close();

}

//login instagram
async function loginInstagram (url, iguser){

  //verify user name that already login
  if (fs.existsSync(path)) {
    //file exists
    var loginuser = iguser //prompt('Multiple Users found, Enter you the User Name to login: ');
    let rawdata = fs.readFileSync(path);
    let userdetails = JSON.parse(rawdata);
    //console.log(userdetails.user.username);
    if ( userdetails.hasOwnProperty(loginuser))
    {
        console.log("Credential found , login as users") 
       // let url = 'https://www.instagram.com';
        //var passowrd = userdetails.hasOwnProperty(loginuser).passowrd;          
        //loginInstagram (url, loginuser,passowrd);  
        pupept.use(StealthPlugin());
        const browser = await pupept.launch({headless: false});  
        const page = await browser.newPage();
        // Emulates an iPhone X
        await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1');
        await page.setViewport({ width: 375, height: 812 });
        await page.bringToFront(); 
        if (userdetails[loginuser].cookies != 0)
        {
          console.log('cookies avaible, redirecting to the users page')
          //console.log('your password: ',userdetails[loginuser].passowrd)
          try{
            await page.setCookie.apply(page, userdetails[loginuser].cookies);
            await page.goto(url, { waitUntil: "networkidle2" }); 
            //navigate user
            await navigateuser(page, url,loginuser);
            const followers = await findfollowers(page);
            //console.log(followers.pics1.length);
            const followings = await findfollowings(page, url,loginuser)
            //console.log(followings.pics2.length);
            //find notfollowing you and not I follow
            const notFollowingYou = followings.pics2.filter(item => !followers.pics1.find(f => f.username === item.username));
            const notFollowingThem = followers.pics1.filter(item => !followings.pics2.find(f => f.username === item.username));
            //console.log('people That not following me: ',notFollowingYou);
            var NTFlwng = JSON.stringify(notFollowingYou);                  
                  fs.writeFileSync(NtFolwngU, NTFlwng); 
                  
            console.log(notFollowingYou.length);
            /*return{
              notFollowingYou,
              notFollowingThem
            } */ 
              }
              catch (err) {
                  console.log(err);
              }
          }
        else{
              var password = userdetails[loginuser].password; 
              loginbycredential(page, url, loginuser, password);
          }// end of cookie else            
      }
  }
}

async function likeusers(url,iguser){

  //verify user name that already login
  if (fs.existsSync(path)) {
    //file exists
    var loginuser = iguser //prompt('Multiple Users found, Enter you the User Name to login: ');
    let rawdata = fs.readFileSync(path);
    let userdetails = JSON.parse(rawdata);
    //console.log(userdetails.user.username);
    if ( userdetails.hasOwnProperty(loginuser))
    {
        console.log("Credential found , login as users") 
        //Initializing Browser
        pupept.use(StealthPlugin());
        const browser = await pupept.launch({headless: false});  
        const page = await browser.newPage();
        // Emulates an iPhone X
        await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1');
        await page.setViewport({ width: 375, height: 812 });
        await page.bringToFront(); 
        if (userdetails[loginuser].cookies != 0)
        {
          console.log('cookies avaible, redirecting to the Home Page')
          //console.log('your password: ',userdetails[loginuser].passowrd)
          try{
            await page.setCookie.apply(page, userdetails[loginuser].cookies);
            await page.goto(url, { waitUntil: "networkidle2" }); 
            //Navigate to DM
            /*const Notification = 'body > div.RnEpo.Yx5HN > div > div > div > div.mt3GC > button.aOOlW.HoLwm'
            page.waitForSelector(Notification, {visible:true}).then(() => {
              console.log('redirected to the Home page')
              page.click(Notification)
              autoScroll(page)
            });*/

            TargetUser = prompt('Enter Follower\'s List to Target: ')
            //click Notification
            /*const Notfications = '#react-root > section > div > div._lz6s.Hz2lF > div > div.ctQZg > div > div:nth-child(4) > a > svg'
            page.waitForSelector(Notfications, {visible:true}).then(() => {
              console.log('Checking Notfications')
              page.click(Notfications)
            });*/
            
            //navigate user's Home Page
            await navigateuser(page, url,TargetUser);
            const followers = await UsersFollowers(page)  
            var userfollowers = JSON.stringify(followers);                  
              //fs.writeFileSync(TargetFollowings, userfollowers);
              for (var x = 0; x < followers.pics1.length; x++) {
                var victimPage = followers.pics1[x];
                console.log('1st followers: ',x)
                console.log(victimPage);
                //navigate to victime page and like 3 post
                //if count is 5, sleep 10 secound
                //like again, swith pages for 20 mins
                //like 10 people
                if (x <= Math.floor(Math.random() * 5)){
                sleep.sleep(Math.floor(Math.random() * 10)); 
                await likeuserprofile(browser,url,victimPage.username)
                }
              }
            //const FirstPost =  '//*[@id="react-root"]/section/main/div/div[2]/article/div[1]/div/div[1]/div[1]/a/div/div[2]'
            //private account #react-root > section > main > div > div > article > div._4Kbb_._54f4m > div > h2
          }
           catch (err) {
                  console.log(err);
              }
          }
        else{
              var password = userdetails[loginuser].password; 
              loginbycredential(page, url, loginuser, password);
          }// end of cookie else            
      }
  }
}

// Navigate to user
async function navigateuser(page, url, username){
    await page.goto(`${url}/${username}`, { waitUntil: "networkidle2" });
}

//likeuserprofile
async function likeuserprofile(browser,url,username){
  const page = await browser.newPage();
  await page.bringToFront();
  await page.goto(`${url}/${username}`, { waitUntil: "networkidle2" });

  console.log('navigated to the Victim')
  const [el2] = await page.$x("//h2[contains(text(),'This Account is Private')]");
  if (typeof el2 != 'undefined'){
    const [el2] = await page.$x("//h2[contains(text(),'This Account is Private')]");
    const Private = await el2.getProperty('textContent');
    const PrivateAcc = await Private.jsonValue();
  }
  const [el3] = await page.$x("//h1[contains(text(),'No Posts Yet')]");
  if (typeof el3 != 'undefined'){
   const [el3] = await page.$x("//h1[contains(text(),'No Posts Yet')]");
   const NoPost = await el3.getProperty('textContent');
   const NoPostAcc = await NoPost.jsonValue();
  } 
  else{
  //click post
  console.log('click user')
  posts = await page.$$('div._9AhH0');
  await posts[0].click()  
  sleep.sleep(Math.floor(Math.random() * 10)); 
  console.log('post clicked')
  const times = 4
  for(let i; i < times; i++){
      
  }
  for (let step = 0; step < 5; step++) {
      console.log("Iam here")
      //like post and click next
      sleep.sleep(Math.floor(Math.random() * 10)); 
      var like = await page.$$("button.wpO6b");
      await like[1].click()
      sleep.sleep(Math.floor(Math.random() * 3)); 
      await page.keyboard.press("ArrowRight", {delay: 3})
     console.log('liked')
  }

}
await page.close();
}

//Target Follower's Scrapping
async function UsersFollowers(page){

  var flwbtn = '#react-root > section > main > div > ul > li:nth-child(2) > a';
  await page.waitForSelector(flwbtn, {visible:true}).then(() => {
    page.click(flwbtn)
  });
  sleep.sleep(5);
  for (i=0; i<10;i++)
  {
    await autoScroll(page);}
  //sleep.sleep(5);
  await page.waitForSelector('#react-root > section > main > div > ul > div > li > div > div > div > a');
  const list1 = page.$$('#react-root > section > main > div > ul > div > li > div > div > div > a');
  let avatarPaths = [
    '#react-root > section > main > div > ul > div > li > div > div > div > a > img',
    '#react-root > section > main > div > ul > div > li > div > div > div > span > img'
    ];
  const pics1 = await avatarPaths.reduce(async (accProm, path) => {
      const acc = await accProm;
      const arr = await page.$$eval(path, res => {
          return res.map(pic => {
              const alt = pic.getAttribute('alt');
              const strings = alt.split(/(['])/g);
              const url = `https://www.instagram.com/${strings[0]}`;
              return {
                  username: strings[0],
                  //userlink: url,
                  //avatar: pic.getAttribute('src')
              }
          })
      });
      return acc.concat([...arr]);
  }, Promise.resolve([]));
  sleep.sleep(3);
  console.log(pics1.length);
  console.log('Target followers done');
  return {pics1};
}

//find followers
async function findfollowers(page){
    //-------------------------------------------------------------------------------------------
    //find followers count
    const followers = await page.$('#react-root > section > main > div > ul > li:nth-child(2) > a > span');
    const fl = await page.evaluate(elm => elm.title, followers);//await followers[0].getProperty('textContent');
    console.log('Totall Followers: ', fl);
    const scroll = (fl * 0.3);
    console.log('Totall Scrolls: ', scroll);
    //click followers 
    var flwbtn = '#react-root > section > main > div > ul > li:nth-child(2) > a';
    await page.waitForSelector(flwbtn, {visible:true}).then(() => {
    page.click(flwbtn)
    });
    sleep.sleep(5);
    for (i=0; i<scroll;i++)
    {
    await autoScroll(page);}
    //sleep.sleep(5);
    await page.waitForSelector('#react-root > section > main > div > ul > div > li > div > div > div > a');
    const list1 = page.$$('#react-root > section > main > div > ul > div > li > div > div > div > a');
   /* const services = await page.evaluate(() =>
    Array.from(document.querySelectorAll('#react-root > section > main > div > ul > div > li > div > div > div > a'), Element => Element.href)
    );*/

    let avatarPaths = [
      '#react-root > section > main > div > ul > div > li > div > div > div > a > img',
      '#react-root > section > main > div > ul > div > li > div > div > div > span > img'
      ];
    const pics1 = await avatarPaths.reduce(async (accProm, path) => {
        const acc = await accProm;
        const arr = await page.$$eval(path, res => {
            return res.map(pic => {
                const alt = pic.getAttribute('alt');
                const strings = alt.split(/(['])/g);
                const url = `https://www.instagram.com/${strings[0]}`;
                return {
                    username: strings[0],
                    userlink: url,
                    avatar: pic.getAttribute('src')
                }
            })
        });
        return acc.concat([...arr]);
    }, Promise.resolve([]));
    sleep.sleep(3);
    console.log(pics1.length);
    console.log('followers done');
    //await page.close();
    return {pics1};
  }

//find followings
async function findfollowings(page, url, username){
    
  /*const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1');
  await page.setViewport({ width: 375, height: 812 });
  await page.bringToFront();
  navigateuser(page,url,username);*/

  sleep.sleep(2)
  
  var backbtn = '#react-root > section > main > header > div > div.mXkkY.HOQT4 > a > span > svg';
    page.waitForSelector(backbtn, {visible:true}).then(() => {
    page.click(backbtn)
    })
    sleep.sleep(2)
  //----------------------------------------------------------------------------------------
    //followings
    const followings = await page.$('#react-root > section > main > div > ul > li:nth-child(2) > a > span');
    const fl = await page.evaluate(elm => elm.title, followings);//await followers[0].getProperty('textContent');
    console.log('Totall Followers: ', fl);
    const scroll = (fl * 0.3);
    console.log('Totall Scrolls: ', scroll);

    //click followings 
    var folwnbtn = '#react-root > section > main > div > ul > li:nth-child(3) > a';
    page.waitForSelector(folwnbtn, {visible:true}).then(() => {
    page.click(folwnbtn)
    })
    sleep.sleep(5);
    //await autoScroll(page);
    for (i=0; i<scroll;i++)
    {
    await autoScroll(page);}
    sleep.sleep(2);
    const slctr = '#react-root > section > main > div > ul';
    await page.waitForSelector(slctr);
    //sleep.sleep(10);
    //getting followings
    await page.waitForSelector('#react-root > section > main > div > ul > div > li > div > div > div > a');
    const list2 = page.$$('#react-root > section > main > div > ul > div > li > div > div > div > a');
   /* const services = await page.evaluate(() =>
    Array.from(document.querySelectorAll('#react-root > section > main > div > ul > div > li > div > div > div > a'), Element => Element.href)
    );*/

    let avatarPaths2 = [
      '#react-root > section > main > div > ul > div > li > div > div > div > a > img',
      '#react-root > section > main > div > ul > div > li > div > div > div > span > img'
      ];
    const pics2 = await avatarPaths2.reduce(async (accProm, path) => {
        const acc = await accProm;
        const arr = await page.$$eval(path, res => {
            return res.map(pic => {
                const alt = pic.getAttribute('alt');
                const strings = alt.split(/(['])/g);
                const url = `https://www.instagram.com/${strings[0]}`;
                return {
                    username: strings[0],
                    userlink: url,
                    avatar: pic.getAttribute('src')
                }
            })
        });
        return acc.concat([...arr]);
    }, Promise.resolve([]));
    console.log(pics2.length);
    console.log('followings is done');
    return {pics2};
  }


//create login info
async function Crealogin(){
    let username;
    let password;
    var hashtags = [];
    let login = prompt('Do you whish to login?(y/n): ');
    if (login == "y"){
        username = prompt('Enter your Username: ');
        password = prompt('Enter your password: ');
        hashtags = prompt("Enter hastags: ").split(",")
        var cookies = []
        try{
        
          return ({ [username]: {username, password, hashtags, cookies}});
          }
          catch (err){
              console.log("");
          }
       
    }
    else
    {
        console.log ("you have'nt pass credentials, limited functionality availble");
        return null;
    }
    
}

//check file exists
async function Config(iguser){
    try {
        if (fs.existsSync(path)) {
          //file exists
          var loginuser = iguser //prompt('Multiple Users found, Enter you the User Name to login: ');
          let rawdata = fs.readFileSync(path);
          //run if rawdata is not empty, else trigger Crealogin()
          if (rawdata != 0){
          let userdetails = JSON.parse(rawdata);
          //console.log(userdetails.user.username);
          if ( userdetails.hasOwnProperty(loginuser) )
          {
              console.log("Credential found , login as users") 
              let url = 'https://www.instagram.com';
              //var passowrd = userdetails.hasOwnProperty(loginuser).passowrd;          
              loginInstagram(url, loginuser);              
            }
            else{
              Crealogin().then((user) => {
                  console.log(user);
                  if (user != null){
                  var data = JSON.stringify(user);                  
                  fs.writeFileSync(path, data); 
                  }
                  else{console.log("You haven't pass the credentail")}           
                  
                });
            }
          }  
          else{
            Crealogin().then((user) => {
                console.log(user);
                if (user != null){
                var data = JSON.stringify(user); 
                console.log(data);                 
                fs.writeFileSync(path, data); 
                }
                else{console.log("You haven't pass the credentail")}           
                
              });
          }
        }        
        
        
    }
      catch(err) {
        console.error(err)
      }
    }


//login by credentails
async function loginbycredential(page, url, instauser, password)
{
    console.log("cookies not found, login using credentail")
    await page.goto(url, { waitUntil: "networkidle2" });
    sleep.sleep(5)
    const loginSelector = '#react-root > section > main > article > div > div > div > div:nth-child(2) > button'   
    page.waitForSelector(loginSelector, {visible:true}).then(() => {
      page.click(loginSelector)
    });
    await page.waitForSelector('input[name="username"]');
    await page.type('input[name="username"]', instauser, {delay: 100});
    await page.type('input[name="password"]', password, {delay: 124 });
    await page.click('button[type=submit]', { delay: 50 });

  
  sleep.sleep(5);
  if ( page.type('input[name="verificationCode"]')){
      //applicable only if the OTP Enabled
     let verificationCode = prompt('Type OTP, if OTP not enabled, press Enter: ');
     var code = verificationCode.toString()
      if (verificationCode != "") {
        await page.type('input[name="verificationCode"]', code, {delay: 124 });
        sleep.sleep(2)
        await page.keyboard.press('Enter')
      }
  }

  const SaveLogin = '#react-root > section > main > div > div > div > button'
  page.waitForSelector(SaveLogin, {visible:true}).then(() => {
      page.click(SaveLogin)
    });
   
  sleep.sleep(2)
  const CheckUrl = page.url()
  if (CheckUrl != 'https://www.instagram.com/accounts/onetap/?next=%2F'){
    //await page.goto(url, { waitUntil: "networkidle2" })
      const SaveLogin = '#react-root > section > main > div > div > div > button'
      page.waitForSelector(SaveLogin, {visible:true}).then(() => {
          page.click(SaveLogin)
        });
  }

  const DMButton = '#react-root > section > nav.gW4DF > div > div > header > div > div.mXkkY.KDuQp > a > svg'
  page.waitForSelector(DMButton, {visible:true}).then(() => {
    //page.click(SaveLogin)
    console.log('redirected to the Home page')
  });
  sleep.sleep(5)
  //Scrape cookies
  page.cookies().then(result =>{
      console.dir(result);
      jsonReader(path, (err, configdata) => {
        if (err) {
          console.log(err);
          return;
        }
        configdata[instauser].cookies = result;
        fs.writeFile(path, JSON.stringify(configdata), err => {
          if (err) console.log("Error writing file:", err);
        });
        console.log(configdata[instauser].cookies);
        
      })
      
  });//end of cookie scraping

  console.log('cookies screpped for next login, please re-run the application')
}

//atuscroll
async function autoScroll(page){
  await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
          var totalHeight = 0;
          var distance = 100;
          var timer = setInterval(() => {
              var scrollHeight = 1000;
              window.scrollBy(0, distance);
              totalHeight += distance;

              if(totalHeight >= scrollHeight){
                  clearInterval(timer);
                  resolve();
              }
          }, 100);
      });
  });
}



//Config('fayas_akram');

likeusers('https://www.instagram.com', 'fayas_akram');

//ScrapeAmazon('https://www.amazon.com/Tot-Tutors-WO166-Super-Sized-Organizer/dp/B07Q7DXGW9/ref=sxin_3?ascsubtag=amzn1.osa.654e599f-3c81-4669-9ffc-95e52f6d9e6c.ATVPDKIKX0DER.en_US&creativeASIN=B07Q7DXGW9&cv_ct_cx=amazonbasics&cv_ct_id=amzn1.osa.654e599f-3c81-4669-9ffc-95e52f6d9e6c.ATVPDKIKX0DER.en_US&cv_ct_pg=search&cv_ct_we=asin&cv_ct_wn=osp-single-source-earns-comm&dchild=1&keywords=amazonbasics&linkCode=oas&pd_rd_i=B07Q7DXGW9&pd_rd_r=1a73377f-dcab-405b-93e5-336f1a1f0332&pd_rd_w=meKrp&pd_rd_wg=kLN67&pf_rd_p=e666d5aa-04ca-46aa-86b0-07ac28e037d4&pf_rd_r=ZBQN2CVQJ793XYV6R53T&qid=1617710221&sr=1-2-64f3a41a-73ca-403a-923c-8152c45485fe&tag=offersblog-20');
