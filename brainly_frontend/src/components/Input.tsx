interface inputProp{
    "type": string;
    "placeholder": string;
    "onChange"?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    "value": string
}

export default function Input(props: inputProp){
    return (
        <div>
           <input type={props.type} placeholder={props.placeholder} onChange={props.onChange} value={props.value} className="border-gray-200 border-1 rounded p-1 text-xl w-80"></input>
        </div>
    )
}