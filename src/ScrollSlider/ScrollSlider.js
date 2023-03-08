import React, { useRef, useEffect } from "react";
import "./ScrollSlider.css";
import images from "../Assets/images";

const ScrollSlider = () => {
  const imageSlider = useRef();

  let xPos = "0"; //This variable is for keeping track of where user clicked on screen.
  let xPercentageMoved = "0"; //This calculates in percentage the amount of screen we have moved.
  const handleMouseDown = (event) => {
    //Whenever user clicks on screen, we update the value of xPos.
    xPos = event.clientX;
  };

  const handleMouseUp = (event) => {
    xPos = "0"; //Whenever user releases, we reset value of xPos
  };

  const handleMouseMove = (event) => {
    if (xPos === "0") return; //to stop screen from moving
    const mouseDelta = parseFloat(xPos) - event.clientX; //amount of mouse that has moved
    const maxDelta = window.innerWidth / 2; //We want the whole slider to move to end when we move mouse across half width of screen, hence width/2
    const percentage = (mouseDelta / maxDelta) * -4; //how fast we want slider to move. Personal preference. Can change speed by changing -4 
    const nextPercentageUnconstrained = parseFloat(xPercentageMoved) + percentage;
    const nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0),-100); // to prevent canvas from overflowing on either sides
    xPercentageMoved = nextPercentage; //storing value into how much we have moved

    imageSlider.current.animate( //this is to animate when slider is moving to give it a free motion
      {
        transform: `translate(${nextPercentage}%, -50%)`,
      },
      { duration: 1200, fill: "forwards" }
    );

    for (const image of imageSlider.current.getElementsByClassName("image")) { //iterate over each image
      image.animate( //animating images
        {
          objectPosition: `${100 + nextPercentage}% center`,
        },
        { duration: 1000, fill: "forwards" }
      );
    }
  };

  useEffect(() => { //adding event listeners which are required
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);
    return () => {//Cleanup: unmount eventlisteners when user leaves page
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return ( //iterating over images to display them.
    <div ref={imageSlider} className="image-track" id="img-track">
      {images.map((image, index) => {
        return <img src={image} className="image" alt="" draggable="false" />;
      })}
    </div>
  );
};

export default ScrollSlider;
