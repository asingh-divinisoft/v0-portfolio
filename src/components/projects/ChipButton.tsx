
import {experience_data} from './Data'

type ChipButtonProps = {
    id: string,
    onClick: (key: string) => void
}

const ChipButton = (props: ChipButtonProps) => {
    const { id, onClick } = props;
    const key = id.split(':')[1];

    return (
        <button className='chip_button' onClick={() => onClick(id)}>
            {experience_data[key].role}⋅{experience_data[key].name}
        </button>
    )
}

export default ChipButton