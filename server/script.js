const pupept = require ('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

const filterObjectArray = require('filter-object-array');

//sleep
const sleep = require ('sleep');

//initialize script
const script = async username =>{
      
        pupept.use(StealthPlugin());
        const browser = await pupept.launch({headless: false});  
        const page = await browser.newPage();
        // Emulates an iPhone X
        await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1');
        await page.setViewport({ width: 375, height: 812 });
        await page.bringToFront();
        const url = "https://www.instagram.com/accounts/login/"
        await page.goto(url, { waitUntil: "networkidle2" });
        sleep.sleep(5)
        const loginSelector = '#react-root > section > main > article > div > div > div > div:nth-child(2) > button'   
        page.waitForSelector(loginSelector, {visible:true}).then(() => {
        page.click(loginSelector)
        });
        await page.waitForSelector('input[name="username"]');
        await page.type('input[name="username"]', 'username', {delay: 100});
        await page.type('input[name="password"]', 'password', {delay: 124 });
        await page.click('button[type=submit]', { delay: 50 });
        sleep.sleep(5)
        //Navigate to users profile
        await page.goto(`https://www.instagram.com/${username}`, { waitUntil: "networkidle2" });
        sleep.sleep(15)
        console.log('navigated to user')
        //Find followings and not followings
        const followers = await findfollowers(page);
        const flwrcount = followers.length;
        
        const followings = await findfollowings(page)
        const flwngcount = followings.length;
        
        //find notfollowing you and not I follow
        const notFollowingYou = followings.pics2.filter(item => 
            !followers.pics1.find(f => f.username === item.username));
        const notFollowingThem = followers.pics1.filter(item => 
            !followings.pics2.find(f => f.username === item.username));
 
        //return to users
        await browser.close();
        return{
            flwrcount,
            flwngcount,
            notFollowingYou,
            notFollowingThem,
            followers,
            followings
        }


};

//find followers
async function findfollowers(page){
    //-------------------------------------------------------------------------------------------
    console.log('navigated to fllowing')
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

//findfollowings
async function findfollowings(page){
    
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
        const followings = await page.$('#react-root > section > main > div > ul > li:nth-child(3) > a > span');
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

module.exports = {script};
