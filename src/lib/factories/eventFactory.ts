import {EventService} from "@/lib/services"
import {EventControlller } from "@/lib/controllers"

export function createEventController(){
    const eventService = new EventService();
    return new EventControlller(eventService)
}