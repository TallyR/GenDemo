//used a lot
export function extractStringBeforeLastAt(input) {
    // Find the index of the last occurrence of '@'
    const lastIndex = input.lastIndexOf('@');
    
    if(lastIndex === -1) {
        return input
    }

    // Extract the substring before the last '@'
    const extractedString = input.substring(0, lastIndex);

    return extractedString;
}