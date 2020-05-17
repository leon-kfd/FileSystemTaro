const icons = ['folder', 'word', 'ppt', 'excel', 'pdf', 'txt', 'zip', 'psd', 'jpg', 'mp3', 'video', 'html', 'white', 'exe']
const iconsMap = {
  folder: `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTg3Mzk0Mjk0MjExIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjI4NzUiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNOTc3LjYgMjM4LjRjLTkuNi05LjYtMjEuNi0xNC40LTMzLjYtMTQuNEg0NzJMMzY2LjQgMTE4LjRjLTQtNC05LjYtOC0xNS4yLTEwLjQtNi40LTIuNC0xMi00LTE4LjQtNEg4MGMtMTIgMC0yNC44IDQuOC0zMy42IDE0LjRTMzIgMTQwIDMyIDE1MnYyODBoOTYwVjI3MmMwLTEyLTQuOC0yNC44LTE0LjQtMzMuNnoiIGZpbGw9IiNGRkQ3NjYiIHAtaWQ9IjI4NzYiPjwvcGF0aD48cGF0aCBkPSJNOTQ0IDkxMkg4MGMtMjYuNCAwLTQ4LTIxLjYtNDgtNDhWMzUyaDk2MHY1MTJjMCAyNi40LTIxLjYgNDgtNDggNDh6IiBmaWxsPSIjRkZBQzMzIiBwLWlkPSIyODc3Ij48L3BhdGg+PC9zdmc+`,
  white: `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTg3Mzk0MjY0NDU2IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE5MzYiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PGRlZnM+PHN0eWxlIHR5cGU9InRleHQvY3NzIj48L3N0eWxlPjwvZGVmcz48cGF0aCBkPSJNMTYwIDMyYy0xMiAwLTI0LjggNC44LTMzLjYgMTQuNFMxMTIgNjggMTEyIDgwdjg2NGMwIDEyIDQuOCAyNC44IDE0LjQgMzMuNiA5LjYgOS42IDIxLjYgMTQuNCAzMy42IDE0LjRoNzA0YzEyIDAgMjQuOC00LjggMzMuNi0xNC40IDkuNi05LjYgMTQuNC0yMS42IDE0LjQtMzMuNlYzMDRMNjQwIDMySDE2MHoiIGZpbGw9IiNFNUU1RTUiIHAtaWQ9IjE5MzciPjwvcGF0aD48cGF0aCBkPSJNOTEyIDMwNEg2ODhjLTEyIDAtMjQuOC00LjgtMzMuNi0xNC40LTkuNi04LjgtMTQuNC0yMS42LTE0LjQtMzMuNlYzMmwyNzIgMjcyeiIgZmlsbD0iI0NDQ0NDQyIgcC1pZD0iMTkzOCI+PC9wYXRoPjwvc3ZnPg==`
}
// icons.map(item => {
//   iconsMap[item] = require(`../assets/file-icon/${item}.svg`)
// })
const typesMap = {
  folder: iconsMap.folder,
  doc: iconsMap.word,
  docx: iconsMap.word,
  xls: iconsMap.excel,
  xlsx: iconsMap.excel,
  ppt: iconsMap.ppt,
  pptx: iconsMap.ppt,
  pdf: iconsMap.pdf,
  txt: iconsMap.txt,
  zip: iconsMap.zip,
  rar: iconsMap.zip,
  jpg: iconsMap.jpg,
  gif: iconsMap.jpg,
  png: iconsMap.jpg,
  jpge: iconsMap.jpg,
  svg: iconsMap.jpg,
  jpe: iconsMap.jpg,
  mp3: iconsMap.mp3,
  mp4: iconsMap.video,
  avi: iconsMap.video,
  wmv: iconsMap.video,
  html: iconsMap.html,
  md: iconsMap.html,
  js: iconsMap.html,
  css: iconsMap.html,
  exe: iconsMap.exe,
  unknown: iconsMap.white
}
export default typesMap
