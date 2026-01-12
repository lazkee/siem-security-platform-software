import { IoClose } from "react-icons/io5";
import { EventRow } from "../../types/events/EventRow";
import { IParserAPI } from "../../api/parser/IParserAPI";
import { useEffect, useState } from "react";

interface PropsEvent {
    parserApi: IParserAPI;
    onClose: () => void;
}

export default function EventDetailsPanel({
    parserApi,
    onClose,
}: PropsEvent) {

    const token = "token";      // TODO: DELETE AFTER TESTING!
    const [rawMsg, setRawMsg] = useState<string>();

    useEffect(() => {
        //if (!token) return;       // TODO: DELETE COMMENT AFTER TESTING!

        const loadEventRawMessage = async () => {
            try {
                /*console.log(e.id);
                setRawMsg((await parserApi.getParserEventById(e.id, token)).text_before_parsing);*/
            } catch (err) {
                console.error(err);
                setRawMsg("Currently not available.");
            }
        };

        void loadEventRawMessage();
    }, [token]);
    const badgeClass = (color: string) =>
        `inline-block px-3 py-1 text-sm font-semibold text-[${color}] `;

    return (
        <div
            className="fixed inset-0 bg-black/30 backdrop-blur-lg flex justify-center items-center z-[1000]"
            onClick={onClose}
        >
            <div
                className="bg-[#1f1f1f]  rounded-2xl w-[90%] max-w-[700px] max-h-[100vh]! overflow-auto border border-[#333] shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-[#333] bg-[#2a2a2a] rounded-t-2xl">
                    <div></div>
                    <h2 className="m-0 text-xl">Event Details</h2>
                    <button
                        onClick={onClose}
                        className="bg-transparent border-none cursor-pointer text-white text-2xl p-0 flex items-center"
                    >
                        <IoClose />
                    </button>
                </div>

                {/* Content */}
                <div className="flex flex-col p-3! gap-2!">
                    <div className="mb-5">
                        <label className="block text-base text-gray-400 mb-1">Event ID</label>
                        <div className="text-white font-mono text-m">#1</div>
                    </div>

                    <div className="mb-5">
                        <label className="block text-base text-gray-400 mb-1">Source</label>
                        <div className="text-white text-m font-semibold">source</div>
                    </div>



                    {/* Description */}
                    <div className="mb-5">
                        <label className="block text-base text-gray-400 mb-1">Description</label>
                        <div className="text-white text-m leading-relaxed">sdasdda</div>
                    </div>

                    {/* Source */}
                    <div className="mb-5">
                        <label className="block text-base text-gray-400 mb-1">Time</label>
                        <div className="text-white text-m">{new Date().toLocaleString("en-GB")}</div>
                    </div>

                    {/* Raw message */}
                    <div className="mb-5">
                        <label className="block text-base text-gray-400 mb-1">Raw message</label>
                        <div className="text-white text-m">sdasd</div>
                    </div>

                </div>
            </div>
        </div>
    );
}
