
export default function TableLoader({ colCount }) {

  function getRandomWidth() {
    const widths = ['w-[75%]', 'w-full'];
    return widths[Math.floor(Math.random() * widths.length)];
  }

  return (
      <>
        {Array.from({ length: 10 }).map((_, i) => (
          <tr key={i}>
            {Array.from({ length: colCount }).map((_, j) => (
              <td key={j} className="px-4 py-2">
                <div className={`h-8 bg-gray-200 rounded-2xl animate-pulse ${getRandomWidth()}`}></div>
              </td>
            ))}
          </tr>
        ))}
      </>
    )
}
