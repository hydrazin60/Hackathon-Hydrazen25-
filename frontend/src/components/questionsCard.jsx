export default function QuestionsCard({question, answer}){
    return (
        <div className="bg-card rounded-2xl p-8 text-white">
            <div className="text-lg font-bold">{question}</div>
            <div className="text-sm">{answer}</div>
        </div>
    )
}