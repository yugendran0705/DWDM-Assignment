class TreeNode {
    constructor(attribute, value) {
        this.attribute = attribute;
        this.value = value;
        this.children = [];
        this.result = null;
    }
}

function entropy(data) {
    const total = data.length;
    const counts = {};
    for (const row of data) {
        const target = row[row.length - 1];
        if (!(target in counts)) counts[target] = 0;
        counts[target]++;
    }
    let entropy = 0;
    for (const target in counts) {
        const probability = counts[target] / total;
        entropy -= probability * Math.log2(probability);
    }
    return entropy;
}

function informationGain(data, attributeIndex) {
    const totalEntropy = entropy(data);
    const attributeValues = {};
    for (const row of data) {
        const value = row[attributeIndex];
        if (!(value in attributeValues)) attributeValues[value] = [];
        attributeValues[value].push(row);
    }
    let remainder = 0;
    for (const value in attributeValues) {
        const subset = attributeValues[value];
        const subsetEntropy = entropy(subset);
        const probability = subset.length / data.length;
        remainder += probability * subsetEntropy;
    }
    return totalEntropy - remainder;
}

function modeValue(data) {
    const counts = {};
    for (const row of data) {
        const target = row[row.length - 1];
        if (!(target in counts)) counts[target] = 0;
        counts[target]++;
    }
    let modeValue = null;
    let maxCount = -Infinity;
    for (const target in counts) {
        if (counts[target] > maxCount) {
            modeValue = target;
            maxCount = counts[target];
        }
    }
    return modeValue;
}

function id3(data, attributes) {
    const targetValues = [...new Set(data.map(row => row[row.length - 1]))];
    if (targetValues.length === 1) {
        const leafNode = new TreeNode(null, null);
        leafNode.result = targetValues[0];
        return leafNode;
    }
    if (attributes.length === 0) {
        const mode = modeValue(data);
        const leafNode = new TreeNode(null, null);
        leafNode.result = mode;
        return leafNode;
    }
    let bestAttributeIndex = 0;
    let maxInformationGain = -Infinity;
    for (let i = 0; i < attributes.length; i++) {
        const attributeIndex = attributes[i];
        const gain = informationGain(data, attributeIndex);
        if (gain > maxInformationGain) {
            maxInformationGain = gain;
            bestAttributeIndex = attributeIndex;
        }
    }
    const rootNode = new TreeNode(bestAttributeIndex, null);
    rootNode.attribute = bestAttributeIndex; // Set the result value for the root node
    const attributeValues = [...new Set(data.map(row => row[bestAttributeIndex]))];
    for (const value of attributeValues) {
        const subset = data.filter(row => row[bestAttributeIndex] === value);
        const childNode = id3(subset, attributes.filter(attr => attr !== bestAttributeIndex));
        childNode.value = value;
        rootNode.children.push(childNode);
    }
    return rootNode;
}

function predict(node, instance) {
    if (node.result) return node.result;
    const attributeValue = instance[node.attribute];
    const childNode = node.children.find(child => child.value === attributeValue);
    return predict(childNode, instance);
}

// // Example dataset
// const dataset = [
//     ['Sunny', 'Hot', 'No'],
//     ['Sunny', 'Hot', 'No'],
//     ['Overcast', 'Hot', 'Yes'],
//     ['Rainy', 'Mild', 'Yes'],
//     ['Rainy', 'Cool', 'Yes'],
//     ['Sunny', 'Cool', 'Yes'],
//     ['Rainy', 'Mild', 'No'],
//     ['Sunny', 'Mild', 'Yes']
// ];

// // Attributes: Outlook and Temperature
// const attributes = [0, 1];

// // Build decision tree
// const decisionTree = id3(dataset, attributes);

// // Test prediction
// const instance = ['Sunny', 'Hot'];
// console.log(predict(decisionTree, instance)); // Output: No

export { id3, predict };
