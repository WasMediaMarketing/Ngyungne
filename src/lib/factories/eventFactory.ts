import {EventService} from "@/lib/services"
import {EventController } from "@/lib/controllers"

export function createEventController(){
    const eventService = new EventService();
    return new EventController(eventService)
}