import { createEventController } from "@/lib/factories/eventFactory";
import { validateEventInput,isAuthenticated } from "@/lib/middlewares";
import { handleMultipartRequest } from "@/lib/utils/multipartHandler";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    const authResult = await isAuthenticated(req);
    if(authResult) return authResult;
    const uploadFields = [{fileField: "image", bodyField:"image"},{fileField:"teacherImage",bodyField:"teacher.image"}];
    const jsonFields = ["tags","teacher","schedule"];
    const processedRequest = await handleMultipartRequest(
        req,
        uploadFields,
        jsonFields
    );
    if(processedRequest instanceof NextResponse) return processedRequest;

    const validationResponse = await validateEventInput(processedRequest);

    if (validationResponse) return validationResponse;

    const eventController = createEventController();
    return eventController.createEvent(processedRequest);
}

export async function Get(req: NextRequest){
    const authResult = await isAuthenticated(req);
    if(authResult) return authResult;

    const eventController = createEventController();

    return eventController.getEvents();
}

export async function DELETE(req:NextRequest){
    const authResult = await isAuthenticated(req);
    if(authResult) return authResult;

    const eventController = createEventController();
    return eventController.deleteEvents(req);
}