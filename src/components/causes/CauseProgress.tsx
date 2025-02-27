import { Button } from "@/components/ui/button";
import { CalendarDays, Users, MapPin, Heart } from "lucide-react";

interface CauseProgressProps {
  cause: {
    raised: number;
    goal: number;
    startDate: string;
    endDate: string;
    volunteers: number;
    location: string;
    totalDonors: number;
  };
  onDonate: () => void;
}

export function CauseProgress({ cause, onDonate }: CauseProgressProps) {
  const percentageRaised = Math.floor((cause.raised / cause.goal) * 100);

  const formatDate = (dateString: string) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(
      "en-US",
      options as Intl.DateTimeFormatOptions
    );
  };

  return (
    <div className="bg-saffron-50 rounded-lg p-6 mb-8">
      <div className="flex flex-col sm:flex-row justify-between mb-4">
        <div>
          <p className="text-lg font-medium text-maroon-800">Raised so far</p>
          <p className="text-3xl font-bold text-crimson-700">
            ${cause.raised.toLocaleString()}
          </p>
        </div>
        <div className="text-right mt-4 sm:mt-0">
          <p className="text-maroon-600">
            Goal: ${cause.goal.toLocaleString()}
          </p>
          <p className="text-lg font-medium text-maroon-700">
            {percentageRaised}% Complete
          </p>
        </div>
      </div>

      <div className="h-4 bg-gray-100 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-crimson-500 to-crimson-600 rounded-full"
          style={{ width: `${percentageRaised}%` }}
        ></div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4 text-center">
          <CalendarDays className="mx-auto mb-2 h-6 w-6 text-crimson-600" />
          <p className="text-sm text-maroon-500">Duration</p>
          <p className="font-medium text-maroon-800">
            {formatDate(cause.startDate).split(",")[0]} -{" "}
            {formatDate(cause.endDate).split(",")[0]}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 text-center">
          <Users className="mx-auto mb-2 h-6 w-6 text-crimson-600" />
          <p className="text-sm text-maroon-500">Volunteers</p>
          <p className="font-medium text-maroon-800">{cause.volunteers}</p>
        </div>
        <div className="bg-white rounded-lg p-4 text-center">
          <MapPin className="mx-auto mb-2 h-6 w-6 text-crimson-600" />
          <p className="text-sm text-maroon-500">Location</p>
          <p className="font-medium text-maroon-800">{cause.location}</p>
        </div>
        <div className="bg-white rounded-lg p-4 text-center">
          <Heart className="mx-auto mb-2 h-6 w-6 text-crimson-600" />
          <p className="text-sm text-maroon-500">Donors</p>
          <p className="font-medium text-maroon-800">{cause.totalDonors}</p>
        </div>
      </div>

      <Button
        onClick={onDonate}
        className="w-full bg-crimson-600 text-white hover:bg-crimson-700 py-6 rounded-lg text-lg shadow-md transition-transform hover:translate-y-[-2px]"
      >
        <Heart className="mr-2 h-5 w-5" /> Donate Now
      </Button>
    </div>
  );
}
