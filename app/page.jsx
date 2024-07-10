import style from "./page.module.css"
import Features from "@/app/Components/Features";
import LoginButton from "@/app/Components/LoginButton";
export default function Home() {

	return (
		<div>
			<div className={style.main_box}>
				<div className={style.navbar}>
					<img src={"/discord-logo-white.svg"} alt={"logo"} width={"100px"} />
					<LoginButton className={style.login_btn}/>
				</div>
				<div className={style.hero_box}>
					<h1 className={style.hero_tag}>IMAGINE A PLACE...</h1>
					<p className={style.hero_description}>...where you can belong to a school club, a gaming group, or a worldwide art community. Where just you and a handful of friends can spend time together. A place that makes it easy to talk every day and hang out more often.</p>
					<img className={style.background}  src={"/644fab4da9dbd93a7dfae97b_e6d57714479874c665b36c7adee76b1d.svg"}/>
					<img className={style.child2} src={"/644fab4df2dc8d7a9a081ebd_8a8375ab7908384e1fd6efe408284203.svg"}/>
					<img className={style.child3}   src={"/644fab4db9ca0a124b73d4b7_c40c84ca18d84633a9d86b4046a91437.svg"}/>
				</div>
			</div>
			<Features
				title={"Create an invite-only place where you belong"}
				description={"Discord servers are organized into topic-based channels where you can collaborate, share, and just talk about your day without clogging up a group chat."}
				imgSrc={"6582c18a9cff186bd3731704_Create an invite-only place where you belong.svg"}/>
			<Features
				title={"Where hanging out is easy"}
				description={"Grab a seat in a voice channel when you’re free. Friends in your server can see you’re around and instantly pop in to talk without having to call."}
				bgColor={"whitesmoke"}
				left={false}
				imgSrc={"6582c1b717efff2306ef179e_Where hanging out is easy.svg"}/>
			<Features
				title={"From few to a fandom"}
				description={"Get any community running with moderation tools and custom member access. Give members special powers, set up private channels, and more."}
				imgSrc={"6582c1d8348e5c81ca608138_From few to a fandom.svg"}/>
			<div className={style.footer}>
				<img src={"discord-logo-white.svg"} width={"100px"}/>
			</div>
		</div>
	);	
}
