interface imageSize{
    imageProp:"sm" | "md" | "lg"
}

const imageStyle = {
    "sm": "w-3 h-4",
    "md": "w-5 h-5",
    "lg": "w-6 h-6",
};

export default function Close(props: imageSize) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={imageStyle[props.imageProp]}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
    );
}


