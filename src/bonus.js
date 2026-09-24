var longestCommonPrefix = function(strs) {
    if (!strs || strs.length === 0) return "";
    
    strs.sort();
    
    let firstStr = strs[0];
    let lastStr = strs[strs.length - 1];
    let commonPrefix = "";
    
    for (let i = 0; i < firstStr.length; i++) {
        if (firstStr[i] === lastStr[i]) {
            commonPrefix += firstStr[i];
        } else {
            break; 
        }
    }
    
    return commonPrefix;
};