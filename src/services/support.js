function formatarCpf (cpf) {
    cpf = cpf.replace(/\D/g, "");
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return cpf;
} 

function formatarData (data) {
    data = data.replace(/\D/g, "");
    data = data.replace(/(\d{2})(\d)/, "$1/$2");
    data = data.replace(/(\d{2})(\d)/, "$1/$2");
    return data;
}