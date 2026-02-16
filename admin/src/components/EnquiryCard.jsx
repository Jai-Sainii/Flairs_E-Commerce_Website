function EnquiryCard({ enquiry }) {
  return (
    <div className="border border-black bg-white p-5 space-y-3 shadow-sm">

      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-bold text-black">
            {enquiry.name}
          </h2>
          <p className="text-sm text-black">
            {enquiry.email}
          </p>
        </div>

        <span className="text-xs text-black">
          {new Date(enquiry.createdAt).toLocaleDateString()}
        </span>
      </div>     

      <div>
        <p className="text-sm font-semibold text-black">
          Subject
        </p>
        <p className="text-sm text-black">
          {enquiry.subject}
        </p>
      </div>

      <div>
        <p className="text-sm font-semibold text-black">
          Message
        </p>
        <p className="text-sm text-black leading-relaxed">
          {enquiry.message}
        </p>
      </div>
    </div>
  );
}

export default EnquiryCard;
