import { Queue } from "queue-typescript";
import { BubbleSchedulerQueue, BubblesDataModel, BubbleInfo, BubbleState } from "../interfaces/bubbleInterfaces";

 /**
 * This class is used for managaing the bubbles data.
*/
class BubbleFunctions {

    constructor()
    {

    }
    
    /**
     * This methods the bubbles data like currentsize, previoussize,bubble hashmap, bubbles queue. 
    */
    public setBubblesData(gameId: string, bubbleList : Array<BubbleInfo>,bubbleData : BubblesDataModel) : void {

        bubbleData.currentBubbles = bubbleData.currentBubbles + bubbleList.length;
        bubbleData.previousSizeOfBubbles = bubbleData.previousSizeOfBubbles + bubbleList.length;
        this.pushBubbleToQueue(bubbleData,bubbleList);
        this.setBubbleHashMapData(gameId,bubbleList,bubbleData);
    }

    /**
     * This method pushes the list of the generated bubbles into the queue.
    */
    public pushBubbleToQueue(clientBubbleData: BubblesDataModel , bubbleList: Array<BubbleInfo>) : void
    {
        for(let i=0; i<bubbleList.length;i++)
        {
         clientBubbleData.bubblesQueue.append(bubbleList[i])
        }
    }

    /**
     * This method arranges each bubble in the hashmap with key as bubbleId and value bubble data.
    */
    public setBubbleHashMapData(gameId:string, bubbleList : Array<BubbleInfo>,bubblesData :BubblesDataModel) : void
    {   
        for(let i = 0; i<bubbleList.length; i++)
        {   
           bubblesData.bubblesHashMap.set(bubbleList[i].id,bubbleList[i]);
        }
    }
    
    /**
     * This method updates the bubble status as poped.
    */
    public removeBubbleInfo(bubblesData : BubblesDataModel, id:string) : void
    {
        try {
            let bubble:BubbleInfo = bubblesData.bubblesHashMap.get(id) as BubbleInfo;
            bubble.state = BubbleState.Poped;
            bubblesData.currentBubbles = bubblesData.currentBubbles - 1;
            bubblesData.poppedCount = bubblesData.poppedCount + 1;
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * This method clear all the scheduler time of the bubble.
    */
    public clearBubbleSchedulerTime(queue : Queue<BubbleSchedulerQueue>, bubbleId : string) : void
    {
        let arr = queue.toArray();
        arr.forEach((element: BubbleSchedulerQueue) => {
            if(element.bubbleInfo.id == bubbleId)
            { 
               clearTimeout(element.timer);
               queue.remove(element);
            }
        });
    }

    /**
     * This method clears all the previous bubbles data of the client.
    */
    public clearPreviousGameBubbleData(bubblesData : BubblesDataModel) : void
    {
        while(bubblesData.bubblesQueue.length !=0)
        {
        
            bubblesData.bubblesQueue.removeHead();
        }
        while(bubblesData.pauseData.length !=0)
        {
            
            clearTimeout(bubblesData.pauseData.head.remainingTime);
            bubblesData.pauseData.removeHead();
        }
        while(bubblesData.bubblesSchedulerQueue.length !=0)
        {
        
            clearTimeout(bubblesData.bubblesSchedulerQueue.head.timer);
            bubblesData.bubblesSchedulerQueue.removeHead();
        }
        bubblesData.poppedCount = 0;
        bubblesData.currentBubbles = 0;
        bubblesData.previousSizeOfBubbles = 0;
        bubblesData.bubblesHashMap.clear();
    }
}

export default BubbleFunctions;