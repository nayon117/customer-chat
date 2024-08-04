
const Home = () => {
    return (
        <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">How can we help you today?</h2>
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded-md">
          <p className="text-sm">Recent Chat</p>
          <p className="text-lg">App Setting</p>
          <p className="text-lg">Business Setup</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-md">
          <p className="text-sm">Server Status: Operational</p>
        </div>
        <div className="bg-gray-100 p-4 rounded-md">
          <p className="text-sm">Help</p>
          <p className="text-lg">How can I talk to customer support?</p>
          <p className="text-lg">Can I chat with a live agent?</p>
          <p className="text-lg">How to setup my business?</p>
        </div>
      </div>
    </div>
    )
}
export default Home;