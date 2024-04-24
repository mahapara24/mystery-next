//palindrome
function ispalindrome(str) {
  const isreversed = str.split("").reverse().join("");
  return isreversed === str;
}
console.log(ispalindrome("maam"));
//hi