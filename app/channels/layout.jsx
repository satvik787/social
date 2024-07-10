import style from "./layout.module.css"
import ChannelsSideBar from "@/app/channels/Components/ChannelsSideBar";
import {getSession} from "@/actions/lib";
import {redirect} from "next/navigation";
import {GET_CHANNELS} from "@/Cache/tags.js";
import {getChannels} from "@/actions/channel.js";
import {unstable_cache} from "next/cache.js";


export default async function Layout({children}) {
    const payload = await getSession();
    if(payload === null){
        redirect("/login");
    }
    const getCachedChannels = unstable_cache(
        async (id)=> getChannels(id),
        [GET_CHANNELS],
        {tags:[GET_CHANNELS + payload.id]}
    )
    const channels = await getCachedChannels(payload.id);
    return (
        <main className={style.main}>
            <ChannelsSideBar channelsData={channels} uid={payload.id}></ChannelsSideBar>
            <div className={style.children}>
                {children}
            </div>
        </main>
    );
}