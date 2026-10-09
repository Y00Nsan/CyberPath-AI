"""CyberPath AI Cybersecurity Skill Graph knowledge base."""

SKILLS = {
    "aws": ["aws", "amazon web services", "aws cloud"],
    "aws_iam": ["iam", "aws iam", "identity and access management", "least privilege", "rbac"],
    "cloud_security": ["cloud security", "cloud security architecture", "cloud security controls"],
    "network_security": ["network security", "firewall", "ids", "ips", "network segmentation", "tcp/ip"],
    "siem": ["siem", "splunk", "sentinel", "security information and event management"],
    "incident_response": ["incident response", "incident handling", "incident response plan", "ir"],
    "threat_intelligence": ["threat intelligence", "cyber threat intelligence", "cti", "osint", "mitre att&ck"],
    "vulnerability_management": ["vulnerability management", "vulnerability assessment", "nessus", "qualys", "cve"],
    "python": ["python", "python scripting"],
    "linux": ["linux", "bash", "shell scripting"],
    "wireshark": ["wireshark", "packet analysis", "network traffic analysis"],
    "endpoint_security": ["endpoint security", "edr", "xdr"],
    "identity_security": ["identity security", "authentication", "authorization", "mfa", "zero trust"],
    "security_monitoring": ["security monitoring", "log analysis", "detection engineering"],
    "malware_analysis": ["malware analysis", "reverse engineering", "ghidra", "static analysis", "dynamic analysis"],
    "digital_forensics": ["digital forensics", "forensics", "autopsy", "volatility", "memory forensics"],
    "secure_coding": ["secure coding", "application security", "sast", "dast", "owasp"],
    "cryptography": ["cryptography", "encryption", "public key", "pkI", "hashing"],
    "security_plus": ["security+", "comptia security+"],
    "cloud_certification": ["aws certified", "aws certification", "developer associate", "solutions architect"],
}

RELATIONSHIPS = {
    "aws": ["aws_iam", "cloud_security", "identity_security"],
    "aws_iam": ["cloud_security", "identity_security"],
    "cloud_security": ["aws", "aws_iam", "identity_security", "network_security"],
    "network_security": ["wireshark", "siem", "security_monitoring"],
    "siem": ["security_monitoring", "incident_response", "threat_intelligence"],
    "threat_intelligence": ["osint", "incident_response", "malware_analysis"],
    "malware_analysis": ["digital_forensics", "threat_intelligence"],
    "digital_forensics": ["incident_response", "malware_analysis"],
    "incident_response": ["siem", "digital_forensics", "threat_intelligence"],
    "python": ["secure_coding", "security_monitoring", "malware_analysis"],
    "linux": ["security_monitoring", "incident_response", "network_security"],
}


NICE_MAP = {
    "threat_intelligence": {"category": "Analyze", "work_roles": ["Cyber Defense Analyst", "Threat/Warning Analyst"]},
    "incident_response": {"category": "Protect and Defend", "work_roles": ["Incident Response", "Cyber Defense Analyst"]},
    "network_security": {"category": "Protect and Defend", "work_roles": ["Network Operations", "Cyber Defense Analyst"]},
    "cloud_security": {"category": "Securely Provision", "work_roles": ["Security Architect", "Cyber Defense Analyst"]},
    "aws_iam": {"category": "Securely Provision", "work_roles": ["Security Architect", "Cyber Defense Analyst"]},
    "vulnerability_management": {"category": "Protect and Defend", "work_roles": ["Vulnerability Assessment Analyst", "Cyber Defense Analyst"]},
    "malware_analysis": {"category": "Analyze", "work_roles": ["Malware Analyst", "Cyber Defense Analyst"]},
    "digital_forensics": {"category": "Investigate", "work_roles": ["Digital Forensics Analyst", "Cyber Defense Analyst"]},
    "siem": {"category": "Protect and Defend", "work_roles": ["Cyber Defense Analyst", "Security Operations"]},
}
