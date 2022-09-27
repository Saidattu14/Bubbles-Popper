// @ts-ignore
import {Queue} from 'queue-typescript'
import { BubbleSchedulerQueue, BubbleState, PauseData } from "../interfaces/bubbleInterfaces";
import { clearTimeout } from 'timers';

/**
 * The class is used for managing gamestate pause data
*/
class GameStateFunctions {

    /**
     * The method clears all the scheduler data and creates a pause data.
     * The pause data means the callback remaining time of the schedulers data. 
     * @pausedata @queuedata
    */
    public pauseGame(pauseBubbleData : Queue<PauseData>, queue : Queue<BubbleSchedulerQueue>) : void
    {  
        let arr = queue.toArray();
        arr.forEach((element: BubbleSchedulerQueue) => {
            if(element.bubbleInfo.state == BubbleState.Present)
            {
               this.estimatingAndStoringRemainingTimeout(element,pauseBubbleData);
            }
        });
        while(queue.length !=0)
        {
            queue.removeHead();
        }
    }

    /**
     * The method estimates the remaining timeout of the scheuduler data.
     * @element contains settimout value, callbackFunction, createdtime and bubble data
     * @pauseBubbleData pause queue
    */
    public estimatingAndStoringRemainingTimeout(element:any,pauseBubbleData: Queue<PauseData>) : void
    {
        let timer = Math.ceil((element.createdTime + element.timer._idleStart + element.timer._idleTimeout - Date.now()));
        if(timer > 0)
        {
        let callBackFunction = element.timer._onTimeout;
        let previouslyExceutedTime = Date.now()-element.createdTime;
        let remainingTime = element.timer._idleTimeout - previouslyExceutedTime + 2000;
        let pauseValue:PauseData = {
            callBackFunction : callBackFunction,
            remainingTime : remainingTime,
            bubbleInfo : element.bubbleData,
            bubbleTimeState : element.bubbleTimeState
         }
         pauseBubbleData.append(pauseValue);
        }
        clearTimeout(element.timer);
    }
}
export default GameStateFunctions;