import { detectDevice } from "../../utils/detectMobile";
import MobileShare from "./MobileShare.jsx";
import ShareDrawer from "./ShareDrayerWin.jsx";

const Share = ({url,title,open,onClose}) => {
    const isMobile = detectDevice()
    console.log("In index.jsx" )
    console.log(url, " ", title)
    return (
        <>
            {isMobile?
                <MobileShare url={url} title={title}/>:
                <ShareDrawer url={url} title={title} open={open} onClose={onClose}  />
            }
        </>
    )
}

export default Share