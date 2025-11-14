const CommentsModal = ({ video, onClose }) => {
  const handleBackdropClick = (e) => {
    // Only close if clicking the backdrop, not the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleModalClick = (e) => {
    // Prevent event propagation to avoid interference with video controls
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white w-full h-2/3 rounded-t-3xl overflow-hidden flex flex-col"
        onClick={handleModalClick}
      >
        {/* Comments header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <span className="text-lg font-semibold">
            {video.comments.length} comments
          </span>
          <button
            onClick={onClose}
            className="text-gray-500 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Comments list */}
        <div
          className="flex-1 overflow-y-auto p-4 min-h-0"
          style={{
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain'
          }}
        >
          {video.comments.map((comment, index) => (
            <div key={index} className="flex items-start space-x-3 mb-4">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden flex-shrink-0">
                {comment.profilePic && comment.profilePic.startsWith('/') ? (
                  <img src={comment.profilePic} alt={comment.user} className="w-8 h-8 object-cover" />
                ) : (
                  <span className="text-sm">{comment.profilePic || '👤'}</span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-sm">{comment.user}</span>
                  <span className="text-xs text-gray-500">
                    {comment.daysAgo === 1 ? '1d' : `${comment.daysAgo}d`}
                  </span>
                </div>
                <p className="text-sm text-gray-800 mt-1">{comment.text}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-xs text-gray-500">Reply</span>
                  <span className="text-xs text-gray-500">
                    ❤️ {comment.likes || 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default CommentsModal;