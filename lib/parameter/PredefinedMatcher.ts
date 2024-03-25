export function matchEmail(email: string): RegExpMatchArray {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
}

export function matchUsername(username: string): RegExpMatchArray {
    return username.match(/^[a-zA-Z0-9]+$/);
}

export function matchPhone(phone: string): RegExpMatchArray {
    return phone.match(/^\+[1-9]\d{1,14}$/);
}

export function matchIp(ip: string): RegExpMatchArray {
    return ip.match(/^([0-9]{1,3}\.){3}[0-9]{1,3}$/);
}

export function matchFullName(name: string): RegExpMatchArray {
    return name.match(/^[a-zA-Z]+ [a-zA-Z]+$/);
}

export function matchDomain(domain: string): RegExpMatchArray {
    return domain.match(/^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)+$/);
}
