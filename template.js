// TemplateParser.js

function TemplateParser(template, data) {
    // Regular expression to match placeholders like <%placeholder%>
    const regex = /<%(.*?)%>/g;
    // Replace placeholders in the template with actual data
    return template.replace(regex, (match, placeholder) => {
        // Get the value of the placeholder from the data object
        const value = data[placeholder.trim()];
        // Return the value if found, otherwise return an empty string or a placeholder
        return value !== undefined ? value : `<%${placeholder}%>`;
    });
}

module.exports = TemplateParser;
