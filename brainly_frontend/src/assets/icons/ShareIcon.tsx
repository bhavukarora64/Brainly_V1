interface imageSize{
    imageProp:"sm" | "md" | "lg"
}

const imageStyle = {
    "sm": "w-3 h-4",
    "md": "w-5 h-5",
    "lg": "w-6 h-6",
};

export default function ShareIcon(props: imageSize) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
            className={`${imageStyle[props.imageProp]} inline-block`}
        >
            <path fillRule="evenodd" d="M15.75 4.5a3 3 0 1 1 .825 2.066l-8.421 4.679a3.002 3.002 0 0 1 0 1.51l8.421 4.679a3 3 0 1 1-.729 1.31l-8.421-4.678a3 3 0 1 1 0-4.132l8.421-4.679a3 3 0 0 1-.096-.755Z" clipRule="evenodd" />
        </svg>
    );
}
