import NavLink from "../NavLink";

const Hero = () => (
  <section>
    <div className="custom-screen py-28 text-gray-600">
      <div className="space-y-5 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl text-gray-800 font-extrabold mx-auto sm:text-6xl">
          <span className="relative">
            Effortlessly
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"></span>
          </span>
          {" "}Search and Retrieve {" "}
          {" "}
          <span className="relative">
            Slack Messages
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"> </span>
          </span>
        </h1>

        <p className="max-w-xl mx-auto">
          Find specific messages from your Slack workspace with ease. Search across channels, groups, and direct messages using keywords, dates, or user filters to streamline your communication and stay organized.
        </p>
        <div className="flex items-center justify-center gap-x-3 font-medium text-sm">
          <NavLink
            href="/login"
            className="text-white text-bold text-lg bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 mb-5 hover:from-yellow-500 hover:via-red-500 hover:to-pink-500 hover:ring ring-transparent ring-offset-2 transition"
          >
            Login to Search
          </NavLink>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
