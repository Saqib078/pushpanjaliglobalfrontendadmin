import { useState } from "react";

const FaqSection = ({ formData, setFormData }) => {

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    const addFaq = () => {

        if (!question.trim() || !answer.trim()) return;

        setFormData((prev) => ({
            ...prev,
            faqs: [
                ...prev.faqs,
                {
                    question: question.trim(),
                    answer: answer.trim(),
                },
            ],
        }));

        setQuestion("");
        setAnswer("");
    };

    const removeFaq = (index) => {

        setFormData((prev) => ({
            ...prev,
            faqs: prev.faqs.filter((_, i) => i !== index),
        }));
    };

    const updateFaq = (index, field, value) => {

        const updatedFaqs = [...formData.faqs];

        updatedFaqs[index] = {
            ...updatedFaqs[index],
            [field]: value,
        };

        setFormData((prev) => ({
            ...prev,
            faqs: updatedFaqs,
        }));
    };

    return (

        <div className="space-y-6">

            <h2 className="text-xl font-semibold">
                FAQs
            </h2>

            {/* Add FAQ */}

            <div className="space-y-4 border rounded-lg p-5">

                <input
                    type="text"
                    placeholder="Question"
                    value={question}
                    onChange={(e) =>
                        setQuestion(e.target.value)
                    }
                    className="border rounded-lg px-4 py-2 w-full"
                />

                <textarea
                    rows={4}
                    placeholder="Answer"
                    value={answer}
                    onChange={(e) =>
                        setAnswer(e.target.value)
                    }
                    className="border rounded-lg p-3 w-full"
                />

                <button
                    type="button"
                    onClick={addFaq}
                    className="bg-green-600 text-white px-5 py-2 rounded-lg"
                >
                    Add FAQ
                </button>

            </div>

            {/* Existing FAQs */}

            <div className="space-y-5">

                {formData.faqs.map((faq, index) => (

                    <div
                        key={faq._id || index}
                        className="border rounded-lg p-5 space-y-4"
                    >

                        <div>

                            <label className="font-medium block mb-2">
                                Question
                            </label>

                            <input
                                type="text"
                                value={faq.question}
                                onChange={(e) =>
                                    updateFaq(
                                        index,
                                        "question",
                                        e.target.value
                                    )
                                }
                                className="border rounded-lg px-4 py-2 w-full"
                            />

                        </div>

                        <div>

                            <label className="font-medium block mb-2">
                                Answer
                            </label>

                            <textarea
                                rows={4}
                                value={faq.answer}
                                onChange={(e) =>
                                    updateFaq(
                                        index,
                                        "answer",
                                        e.target.value
                                    )
                                }
                                className="border rounded-lg p-3 w-full"
                            />

                        </div>

                        <div className="flex justify-end">

                            <button
                                type="button"
                                onClick={() =>
                                    removeFaq(index)
                                }
                                className="bg-red-600 text-white px-4 py-2 rounded-lg"
                            >
                                Delete FAQ
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );
};

export default FaqSection;