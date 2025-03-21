interface imageSize{
    imageProp:"sm" | "md" | "lg" | "xl"
}

const imageStyle = {
    "sm": "w-3 h-4",
    "md": "w-5 h-5",
    "lg": "w-6 h-6",
    "xl": "w-9 h-12"
};

export default function OutlineList(props: imageSize) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke='#5944e2' className={imageStyle[props.imageProp]}>
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
        </svg>
    );
}