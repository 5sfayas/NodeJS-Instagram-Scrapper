import React, { useEffect, useState, Component } from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
	return (
		<div>
			<div className="header__nav">
				<div className="header__navLeft">
					<h4>
						<Link to="/">InstaScraper</Link>
					</h4>
				</div>
				<div className="header__navRight">
					<h6 className='border__view'>
						<Link to="#">
							
						</Link>
					</h6>
					<h6 className= 'border__add'>
						<Link to="#">
							
						</Link>
					</h6>
					<h6 className='border__order'>
						<Link to="#">
							
						</Link>
					</h6>
					<h6 className='border__signUp'>
						<Link to="/SignIn">
							Sign In
						</Link>
					</h6>
				</div>
			</div>
		</div>
	);
}

export default NavBar;

