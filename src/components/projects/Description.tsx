import { useState } from 'react'
import { experience_data } from './Data'
import { useArrayState, useMediaMatch } from 'rooks'

type HistoryType = (initialPage: string) => [
    page_name: string,
    pageHistory: string[],
    goBack: (key: string) => void,
    gotoPage: (key: string) => void
];

const useHistory: HistoryType = (initialPage) => {
    const [page_name, setPage] = useState(initialPage);
    const [pageHistory, historyControls] = useArrayState(['/']);

    const goBack = (key: string) => {
        const idx = pageHistory.indexOf(key);
        historyControls.splice(idx + 1, pageHistory.length - idx - 1)
        setPage(key)
    };
    const gotoPage = (key: string) => {
        historyControls.push(key);
        setPage(key)
    };

    return [page_name, pageHistory, goBack, gotoPage]
}

const ExperienceBase = (props: any) => {
    const { id: key, isDark, descFilter, toggleHover } = props;
    const [page_name, pageHistory, goBack, gotoPage] = useHistory('/');

    const logoSrc = isDark ? experience_data[key].logo_dark : experience_data[key].logo_light;

    return (
        <>
            <div className='header' onClick={toggleHover}>
                <div className='title' style={{ textAlign: 'right', paddingRight: '1em' }}>{experience_data[key].name}</div>
                <div>
                    <img src={logoSrc} width='40em'></img>

                </div>
                <div className='title' style={{ paddingLeft: '1em' }}>{experience_data[key].role}</div>
            </div>
            <div className='nav' >

                {pageHistory.map(key =>
                    <a
                        onClick={() => goBack(key)}
                        style={{ padding: '0.3em', whiteSpace: 'break-spaces' }}
                    >{key}{'  >'}</a>
                )}
            </div>
            <div
                className='desc'
                style={{ filter: descFilter }}
            >
                {
                    experience_data[key].description[page_name](gotoPage)
                }
            </div>
        </>
    )
}

type BgBlurCardType = (OriginalComponent: React.FC<any>, higherProps: any) => {buttons: React.FC<any>[], Card: React.FC<any>}

const BgBlurCard: BgBlurCardType = (OriginalComponent: React.FC<any>, higherProps: any) => {
    const { isDark, darkImgUrl, lightImgUrl } = higherProps;
    // For blur
    const [inHover, setHover] = useState(false);
    // Hover is not initialized here because it has to be combined
    // with the toggle button
    const toggleHover = () => setHover(!inHover);

    const NewComponent = (props: any) => {
        // BackDrop depends on Hover
        const contentBackdropFilter = `${inHover ? 'blur(16px)' : 'none'}`;

        // Text Filter depends on hover
        // Original Component must make use of the prop provided
        // to apply Text Filter
        const descFilter = `${inHover ? 'none' : 'blur(4px)'}`;
        props.descFilter = descFilter;

        const bgImageUrl = isDark ? darkImgUrl : lightImgUrl;

        // Image depends on color scheme
        const backgroundImage = `url(${bgImageUrl})`;

        return (
            <div
                className='content'
                onMouseEnter={() => setHover(true)}
            >

                <div className='content-bg' >

                    <div
                        className='content-img'
                        style={{ backgroundImage }}
                    >
                        <div 
                        className='content-grad'
                        style={{
                            backdropFilter: contentBackdropFilter,
                        }}>
                            <OriginalComponent {...props} toggleHover={toggleHover}/>
                        </div>

                    </div>

                </div>

            </div>
        )
    }
    return { buttons: [], Card: NewComponent };
}


const ExperienceCard = (props: any) => {
    const { id: key, isDark } = props;

    const darkImgUrl = experience_data[key].cover_dark;
    const lightImgUrl = experience_data[key].cover_light;

    const bgBlurProps = { isDark: isDark, darkImgUrl: darkImgUrl, lightImgUrl: lightImgUrl }

    return BgBlurCard(ExperienceBase, bgBlurProps);
}


type DescriptionCardProps = {
    id: string,
    onCross: (key: string) => void
}


const DescriptionCard = (props: DescriptionCardProps) => {
    const { id, onCross } = props;
    const key = id.split(':')[1];


    // Bg A/c to Color Scheme
    const isDark = useMediaMatch('(prefers-color-scheme: dark)');

    const pageProps = { id: key, isDark: isDark, descFiler: '' };

    const { buttons, Card } = ExperienceCard(pageProps);


    return (
        <div className="description">
            <div className='sidebar'>

                <button className='close' onClick={() => { onCross(id) }}>
                    X
                </button>
                {
                    buttons.map((Button) =>
                        <Button />
                    )
                }
            </div>

            {Card(pageProps)}

        </div>
    )
}



export default DescriptionCard;
