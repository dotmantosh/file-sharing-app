const kb = 1024;
const mb = kb * kb
const tb = kb * kb * kb

function betterNumber(input) {
  if (input > kb) {
    let newNumber = Math.round(input / kb);
    return `${newNumber}Kb`
  }
  if (input > mb) {
    let newNumber = Math.round(input / mb);
    return `${newNumber}Mb`
  }
  if (input > tb) {
    let newNumber = Math.round(input / tb);
    return `${newNumber}Tb`
  }
}

export default betterNumber