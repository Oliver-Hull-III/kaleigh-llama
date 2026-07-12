import React, {useEffect, useState} from 'react';
import { Routes, Route } from 'react-router-dom';
import './css/App.css';
import './css/utilities.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./Home";
import About from "./About";
import Navbar from './Components/Navbar';
import Art from "./Art";
import Contact from './Contact';
import Footer from './Components/Footer';




export function cacheImage(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => Promise.reject("couldn't load image:" + src);
    img.src = src;
  })
}

function App(){


  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const imgs = [
      'https://u.cubeupload.com/kaleighllama/aboutbglg.png', //about-bg-lg.png
      'https://u.cubeupload.com/kaleighllama/aboutbgsm.png', //about-bg-sm.png
      'https://u.cubeupload.com/kaleighllama/llama.jpg', //llama-lg.png
      'https://u.cubeupload.com/kaleighllama/pypbg.jpg', //pyp-bg.png
      'https://u.cubeupload.com/kaleighllama/requestpaintingbg.jpg', //request-painting-bg.png
      'https://u.cubeupload.com/kaleighllama/kaleighllama.png', //kaleigh-llama.png
      'https://u.cubeupload.com/kaleighllama/portrait.png',  //portrait.png
    ];

    cacheImages(imgs);
  }, []);



  
  const cacheImages = async (srcArray) => {

    document.body.classList.add("no-scroll");

    const promises = await srcArray.map((src) => cacheImage(src));

    await Promise.all(promises);

    document.body.classList.remove("no-scroll");
    setIsLoading(false);
  }


  return(
    <div id = "outermost-div">
      {isLoading ? 
      <div className="loading-overlay">
        <div className="spinner">
          <div className="bounce1"/>
          <div className="bounce2"/>
          <div className="bounce3"/>
        </div>
      </div> 
      : null}

      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/art" element={<Art />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer/>
    </div>
  );
  
}


export default App;