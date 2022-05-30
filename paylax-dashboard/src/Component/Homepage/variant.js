import { type } from "@testing-library/user-event/dist/type";
import { animate, Variants } from "framer-motion";


export const mobilewrap = {
    initial:{
        y:-1000
    },

    animate:{
        y:0,
        transition:{
            delay:0,
            duration:0.8,
            type:"spring"
        }
    }
}

export const fadeInUp= {
 initial:{
     y:40,
     opacity:0
 },
 animate:{
     y:0,
     opacity:1,
     transition:{
         duration:0.5,
         delay:2.8,
         ease:"easeInOut"
     }
 }
}
export const emojiwrap = {
    initial: {
        y:-800
    },
    animate:{
        y:0,
        transition:{
            delay:1.8,
            duration:1,
            type:"spring"
        },
    },

}
export const staggered = {
    initial: {
      
    },
    animate:{
   
        transition:{
            staggerChildren:"0.5"
        },
    },

}

export const emoji = {
    initial: {
      
    },
    animate:{
        y:[10,0,10],
        transition:{
            delay:4,
            duration:4,
            ease:'linear',
            repeat:Infinity,
            
        },
    },

}
export const emojiiii = {
    initial: {
      
    },
    animate:{
        y:[-10,0,-10],
        transition:{
            delay:4,
            duration:4,
            ease:'linear',
            repeat:Infinity,
            
        },
    },

}
export const emojii = {
    initial: {
      
    },
    animate:{
        x:[10,0,10],
        transition:{
            delay:4,
            duration:4,
            ease:'linear',
            repeat:Infinity,
            
        },
    },

}


export const emojiii = {
    initial: {
      
    },
    animate:{
        x:[-10,0,-10],
        transition:{
            delay:4,
            duration:4,
            ease:'linear',
            repeat:Infinity,
            
        },
    },

}

