import { UsersIcon } from "@heroicons/react/24/soled";


const GroupAvatar = ({ group , sizeClass = "w-8" }) => {
    return (
        <>
            <div className={`avatar placeholder`}>
                <div className="bg-gray-400 text-gray-800 w-8 rounded-full">
                    <UsersIcon className="w-4" /> 
                </div>
            </div>
        </>
    );
};

export default GroupAvatar;