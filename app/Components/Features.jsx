import style from "./features.module.css"
function Features({imgSrc,bgColor="white",title,description,left=true}) {
    return (
        <div className={style.container} style={{backgroundColor:bgColor,flexDirection:left ? "row":"row-reverse"}}>
            <img src={imgSrc} width={"500px"}/>
            <div className={style.text_box}>
                <h1>{title}</h1>
                <p> {description}</p>
            </div>
        </div>
    );
}

export default Features;