import { MembershipFAQ } from "@/components/membership/MembershipFAQ";
import { MembershipSelection } from "@/components/membership/MembershipSelection";
import { MembershipManagement } from "@/components/membership/MembershipManagement";

function MembershipPage() {
  return (
    <main className="max-w-[1200px] mx-auto px-4 py-8">
      <div className="my-24">
        <h1 className="mb-2 font-black text-primary">DEINE MITGLIEDSCHAFT</h1>
        <h2 className="text-4xl font-bold mb-8">Mitgliedschaft beantragen</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
          {/* Left Column */}
          <div className="md:col-span-1">
            <MembershipFAQ />
          </div>

          {/* Right Column */}
          <div className="md:col-span-1">
            <MembershipSelection />
          </div>
        </div>
      </div>

      {/* Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Mitgliedschaft verwalten</h2>
        <MembershipManagement />
      </div>
    </main>
  );
}

export default MembershipPage;
