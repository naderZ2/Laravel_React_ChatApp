import TextInput  from "@/Components/TextInput";
import { usePage } from "@inertiajs/react";
import { useState , useEffect } from "react";
import { PencilSquareIcon } from '@heroicons/react/24/outline'


const ChatLayout = ({ children}) => {

    const page =usePage();
    const conversations =page.props.conversations;
    const selectedConversations =page.props.selectedConversations;
    const [localConversations , setLocalConversations] = useState([]); 
    const [sortedConversations , setSortedConversations] = useState([]); 
    const [onlineUsers, setOnlineUsers] = useState({});
    const isUserOnline = (userId) => onlineUsers[userId];


    console.log("conversations" , conversations);
    console.log("selectedConversations", selectedConversations);

    const onSearch = (ev) => {
        const search = ev.target.value.toLowerCase();
        setLocalConversations(
            conversations.filter((conversation) => {
                return (
                conversation.name.toLowerCase().includes(search) 
                );
            })
        );
    };

    useEffect(() => {
        setSortedConversations(
            localConversations.sort((a,b) => {
            if (a.blocked_at && b.blocked_at) {
                return a.blocked_at > b.blocked_at ? 1 : -1 ;

            }else if(a.blocked_at){
                return 1;
            }else if(b.blocked_at){
                return -1;
            }
            if (a.last_message_date && b.last_message_date) {
                return b.last_message_date.localeCompare(a.last_message_date)
                
            }else if(a.last_message_date){
                return -1;
            }else if(b.last_message_date){
                return 1;
            }else{
                return 0;
            }
        })
    )
    },[localConversations]);

    useEffect(() => {
        setLocalConversations(conversations);
    },[conversations]);
    
    useEffect(() => {
        Echo.join("online")
        .here((users) => {
            const onlieUsersObj = Object.fromEntries(users.map((user) => [user.id, user]));
            setOnlineUsers((prevOnlineUser) =>{
                return {
                    ...prevOnlineUser,
                    ...onlieUsersObj
                }
            });


        })
        .joining((user) => {

            setOnlineUsers((prevOnlineUser) => {
                const updatedUsers = {...prevOnlineUser};
                updatedUsers[user.id] = user;
                return {
                    ...prevOnlineUser,
                    [user.id]: user
                }
            })
        })
        .leaving((user) => {
            const updatedUsers = {...prevOnlineUser};
            delete updatedUsers[user.id];
            return updatedUsers;

            
        }).error((error) => {
            console.error("error",error);
        });

        return () => {
            Echo.leave("online");
        };

    },[]);


    return (
        <>

            <div className="flex-1 w-full flex overflow-hidden">
            <div className={` transition-all w-full sm:w-[220px] md:w-[300px] bg-slate-800 flex flex-col overflow-hidden ${ selectedConversations ? "-ml-[100%] sm:ml-0" : "" }`}>
                <div className="flex items-center justify-between py-2 px-3 text-xl font-medium">
                My Conversations
                    <div className="tooltip tooltip-left" data-tip="Create new Group" >
                        <button className="text-gray-400 hover:text-gray-200">
                            <PencilSquareIcon className="w-4 h-4 inline-block ml-2" />
                        </button>
                    </div>
                </div>
                <div className="p-3">
                    <TextInput
                    onKeyUp={onSearch}
                    placeholder="Filter users and groups"
                    className="w-full"
                    />
                </div>
                <div className="flex-1 ocerflow-auto">
                    {sortedConversations && sortedConversations.map((conversation) =>   (
                        <ConversationItem 
                        key={`${
                            conversation.is_group ? "group_" : "user_"
                        }${conversation.id}`} 
                        conversation={conversation}
                        online={!!isUserOnline(conversation.id)}
                        />
                    ))}
                </div>
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
                {children}
            </div>
            </div>
        </>
    )
}

export default ChatLayout;
