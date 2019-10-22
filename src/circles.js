(
  {line: prevLine, circles: prevCircles},
  {line: nextLine, circles: nextCircles}
) =>
  prevLine === nextLine &&
  prevCircles[prevLine.from] === nextCircles[nextLine.from] &&
  prevCircles[prevLine.to] === nextCircles[nextLine.to]

