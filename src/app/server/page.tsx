// import { createEventController } from "@/lib/factories/eventFactory"; // Assuming you have a method to get the service instance
// import { IEvent } from "@/types";

// interface EventResponse {
//   data?: IEvent[];
//   error?: Error;
// }

// export default async function EventsPage({
//   events,
//   error,
// }: {
//   events: IEvent[];
//   error?: string;
// }) {
//   if (error) {
//     return <div>Error loading events: {error}</div>;
//   }

//   return (
//     <div>
//       <h1>All Events</h1>
//       <ul>
//         {events?.map((event) => (
//           <li key={event.id.toString()}>{event.title}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export async function getServerSideProps() {
//   const eventController = createEventController();

//   // Call the method that gets events and assert the type of the return value
//   const {data, error}  = eventController.getEventsForProps() as EventResponse;

//   if (error) {
//     return {
//       props: {
//         error: error.message,  // You can return a string or more detailed error info
//         events: [],
//       },
//     };
//   }
//   console.log("eventGet:",data);
//   return {
//     props: {
//       events: data || [],
//     },
//   };
// }

// app/api/event/page.tsx

// import { createEventController } from "@/lib/factories/eventFactory"; // Adjust the import path as needed
// import { IEvent } from "@/types";

// export default async function EventPage() {
//   const eventController = createEventController();
//   const events = await eventController.getEvents(); // Or any async method you're using to fetch the events.
//   console.log(events);

//   return (
//     <div>
//       <h1>Event List</h1>
//       <ul>
//         {events.map((event: IEvent[]) => (
//           <li key={event.id}>{event.name}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }
