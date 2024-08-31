/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from "react";


// @ts-ignore
const StoryViewer = ({ users, initialUserIndex, onClose }) => {
    const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    // Find the first user with stories
    useEffect(() => {
        if (!users[currentUserIndex]?.stories?.length) {
            // @ts-ignore
            const nextUserWithStories = users.findIndex((user, index) => 
                index > currentUserIndex && user.stories && user.stories.length > 0
            );
            if (nextUserWithStories !== -1) {
                setCurrentUserIndex(nextUserWithStories);
            } else {
                onClose(); // Close the viewer if no users have stories
            }
        }
    }, [currentUserIndex, users]);

    const currentUser = users[currentUserIndex];
    const currentStories = currentUser?.stories || [];

    // // @ts-ignore
    // const prevUser = users.slice(0, currentUserIndex).reverse().find(user => user.stories && user.stories.length > 0);
    // // @ts-ignore
    // const nextUser = users.slice(currentUserIndex + 1).find(user => user.stories && user.stories.length > 0);

    useEffect(() => {
        if (currentStories.length === 0) return;

        const timer = setInterval(() => {
            if (progress < 100) {
                setProgress(prev => prev + 1);
            } else {
                handleNextStory();
            }
        }, 50);

        return () => clearInterval(timer);
    }, [progress, currentUserIndex, currentStoryIndex, currentStories.length]);

    const handleNextStory = () => {
        if (currentStoryIndex < currentStories.length - 1) {
            setCurrentStoryIndex(prev => prev + 1);
            setProgress(0);
        } else {
            // @ts-ignore
            const nextUserIndex = users.findIndex((user, index) => 
                index > currentUserIndex && user.stories && user.stories.length > 0
            );
            if (nextUserIndex !== -1) {
                setCurrentUserIndex(nextUserIndex);
                setCurrentStoryIndex(0);
                setProgress(0);
            } else {
                onClose();
            }
        }
    };

    const handlePrevStory = () => {
        if (currentStoryIndex > 0) {
            setCurrentStoryIndex(prev => prev - 1);
            setProgress(0);
        } else {
            // @ts-ignore
            const prevUserIndex = users.slice(0, currentUserIndex).reverse().findIndex(user => 
                user.stories && user.stories.length > 0
            );
            if (prevUserIndex !== -1) {
                setCurrentUserIndex(currentUserIndex - prevUserIndex - 1);
                setCurrentStoryIndex(users[currentUserIndex - prevUserIndex - 1].stories.length - 1);
                setProgress(0);
            } else {
                onClose();
            }
        }
    };

    if (!currentUser || currentStories.length === 0) {
        return null; // Don't render anything if there are no stories
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="relative w-[350px] h-[600px] bg-black overflow-hidden z-20">
                {/* Progress bars */}
                <div className="absolute top-0 left-0 right-0 flex p-2 z-20">
                    {currentStories.map(
                        // @ts-ignore
                        (_, index) => (
                        <div key={index} className="flex-1 h-1 bg-gray-600 mx-1">
                            <div 
                                className="h-full bg-white"
                                style={{ 
                                    width: `${index === currentStoryIndex ? progress : index < currentStoryIndex ? 100 : 0}%`
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* User info */}
                <div className="absolute top-4 left-4 flex items-center z-20">
                    <img src={`${import.meta.env.VITE_API_URL}/uploads/${currentUser.profilePicture}`} alt={currentUser.username} className="w-8 h-8 rounded-full mr-2" />
                    <span className="text-white font-semibold">{currentUser.username}</span>
                </div>

                {/* Close button */}
                <button className="absolute top-4 right-4 text-white z-20" onClick={onClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Story content */}
                <div className="absolute inset-0 flex items-center justify-center">
                    {currentStories[currentStoryIndex]?.mediaType !== "video" ? (
                        <img src={`${import.meta.env.VITE_API_URL}/uploads/${currentStories[currentStoryIndex]?.mediaUrl}`} alt="Story" className="w-full h-full object-cover" />
                    ) : (
                        <video src={`${import.meta.env.VITE_API_URL}/uploads/${currentStories[currentStoryIndex]?.mediaUrl}`} className="w-full h-full object-cover" autoPlay loop muted />
                    )}
                </div>

                {/* Navigation */}
                <div className="absolute inset-0 flex items-center justify-between z-10" onClick={(e) => e.stopPropagation()}>
                    <div className="w-1/2 h-full" onClick={handlePrevStory}></div>
                    <div className="w-1/2 h-full" onClick={handleNextStory}></div>
                </div>
            </div>
        </div>
    );
};

export default StoryViewer;
