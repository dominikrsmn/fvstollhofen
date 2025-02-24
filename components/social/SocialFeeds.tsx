import FacebookFeed from "./FacebookFeed";
import InstagramFeed from "./InstagramFeed";

export default function SocialFeeds() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 my-12">
      <div className="grid md:grid-cols-2 gap-8">
        <FacebookFeed />
        <InstagramFeed />
      </div>
    </div>
  );
}
