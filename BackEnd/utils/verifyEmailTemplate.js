const verifyEmailTemplate = ({name, url}) => {
    return `
<p>Dear ${name}</p>
<p>Thank you for registering Fine Treats.</p>
<a href="${url}" style="color:white; background:orange; margin-top: 10px,padding:20px,display:block">
    Verify Email
</a>
`;
};

export default verifyEmailTemplate;