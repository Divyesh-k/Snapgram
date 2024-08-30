/* eslint-disable @typescript-eslint/ban-ts-comment */

//@ts-ignore
const StoryItem = ({ user, isCurrentUser = false, onClick, onAddStory , currentUserStory}) => {

// @ts-ignore 
 const handleClick = (e) => {
    if (isCurrentUser && e.target.closest('.add-story-button')) {
      onAddStory();
    } else {
      if(isCurrentUser && currentUserStory){
        console.log("Story Clicked");
        onClick();
      }
      else if(!isCurrentUser) {
        console.log("Story Clicked");
        onClick();
      }
    }
  };

  return (
    <div
      className="avatar flex flex-col items-center mr-10 cursor-pointer relative"
      onClick={handleClick}
    >
      <div className={"ring-primary ring-offset-base-100 ring-offset-2 w-20 rounded-full ring"}>
        <img src={`${import.meta.env.VITE_API_URL}/uploads/${user.profilePicture}`} alt={user.username} />
      </div>
      {isCurrentUser && (
        <div className="add-story-button absolute bottom-7 right-0 w-6 h-6 text-center rounded-full bg-black" style={{border: '1px solid #877EFF', borderWidth: '2px 0 0 2px'}}>
          <span className="text-x font-bold" style={{color: "white"}}>
            +
          </span>
        </div>
      )}
      <span className="text-light-1 text-sm mt-2">
        {!isCurrentUser ? user.username : "Your Story"}
      </span>
    </div>
  );
};

export default StoryItem;