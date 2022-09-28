import { v4 as uuidv4 } from 'uuid';
import colors from "../JsonFiles/color";
import { BubbleInfo, BubbleState, BubblesDataModel} from "../interfaces/bubbleInterfaces";

/**
 * This Class is used For Generating Bubbles
*/
class GenerateBubbles {

    private colors : Array<string>;
    constructor()
    {
       this.colors = colors;
    }
     /**
     * The method returns estimates the how many bubble are required and generates those data for Single Player
     * @size
     * @return list
    */

    public generateBubbles(bubbleData : BubblesDataModel) :  Array<BubbleInfo>
    {
       let list : Array<BubbleInfo> = [];
       if(bubbleData.previousSizeOfBubbles == 0)
       {
          list = this.randomBubbles(20);
       }
       else
       {   
           let previousSentSize = bubbleData.previousSizeOfBubbles - bubbleData.currentBubbles;
           previousSentSize = previousSentSize + 1;
           list = this.randomBubbles(1);
       }
       return list;
    }

    /**
     * The method returns estimates the how many bubble are required and generates those data for double Player
     * @size
     * @return list
    */

    public generateBubblesTwoPlayers(bubbleData : BubblesDataModel) :Array<BubbleInfo>
    {
       let list : Array<BubbleInfo> = [];
       if(bubbleData.previousSizeOfBubbles == 0)
       {
          list = this.randomBubbles(30);
       }
       else
       {   
           let previousSentSize = bubbleData.previousSizeOfBubbles - bubbleData.currentBubbles;
           previousSentSize = previousSentSize + 2;
           list = this.randomBubbles(2);
       }
       return list;
    }

     /**
     * The method returns the random generated Bubbles Data
     * @size
     * @return list
     */
    public randomBubbles(size : number) :  Array<BubbleInfo>
    {
        let list : Array<BubbleInfo> = [];
        for(let i =1; i<=size; i++)
        {
          let bubble : BubbleInfo  = {
            id : uuidv4(),
            color : this.generateColors(),
            state  : BubbleState.Present,
            expiryTime : 0,  
            createdTime : Date.now(),
            notifyTime : 0,
            height : this.generateRandomNumber(0, 100) as number,
            width :  this.generateRandomNumber(0,100) as number,
            visibility: 'visible'
          };
          bubble = this.setBubbleExpiryTime(i,bubble)
          list.push(bubble);
        }
        return list;
    }
    
    /**
     * The method sets Bubble ExpiryTime and Notify Time
     * @index @bubble
     * @return bubble
     */
    public setBubbleExpiryTime(index: number,bubble:BubbleInfo) : BubbleInfo
    {

        bubble.expiryTime = Date.now() + this.generateRandomNumber(25000,30000) + 1000*index;
        bubble.notifyTime = bubble.expiryTime - 5000;
        return bubble;
    }

     /**
     * The method returns the random color
     * @return string
     */
    public generateColors():string {
       
       let randomNumber: number = this.generateRandomNumber(0,colors.length-1);
       return this.colors[randomNumber];
    }
    
    /**
     * The method returns the random number between max and min
     * @min @max
     * @return number
     */
    public generateRandomNumber(min: number, max: number): number
    {
        let num = Math.random() * (max - min) + min;
        return Math.round(num);   
    }
}

export default GenerateBubbles;