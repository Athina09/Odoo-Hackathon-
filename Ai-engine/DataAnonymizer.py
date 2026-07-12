import hashlib
import re
from logger import logger


class DataAnonymizer:
    """Hash/redact PII in ESG entries"""

    def __init__(self, salt: str = "ecosphere-salt"):
        self.salt = salt
        self.pii_patterns = {
            "email": re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'),
            "phone": re.compile(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b'),
            "name": re.compile(r'\b[A-Z][a-z]+ [A-Z][a-z]+\b'),
        }
        logger.info("DataAnonymizer initialized")

    def hash_value(self, value: str) -> str:
        """Create deterministic hash of a value"""
        return hashlib.sha256(f"{self.salt}{value}".encode()).hexdigest()[:12]

    def anonymize_string(self, text: str) -> str:
        """Redact PII from a string"""
        result = text
        for pii_type, pattern in self.pii_patterns.items():
            def replacer(match):
                return f"[{pii_type.upper()}_REDACTED]"
            result = pattern.sub(replacer, result)
        return result

    def anonymize_dict(self, data: dict, fields_to_hash: list = None, fields_to_redact: list = None) -> dict:
        """Anonymize specific fields in a dictionary"""
        fields_to_hash = fields_to_hash or ["email", "phone", "employee_id"]
        fields_to_redact = fields_to_redact or ["name", "address", "notes"]
        
        result = {}
        for key, value in data.items():
            if key in fields_to_hash and isinstance(value, str):
                result[key] = self.hash_value(value)
            elif key in fields_to_redact and isinstance(value, str):
                result[key] = self.anonymize_string(value)
            elif isinstance(value, dict):
                result[key] = self.anonymize_dict(value, fields_to_hash, fields_to_redact)
            elif isinstance(value, list):
                result[key] = [
                    self.anonymize_dict(v, fields_to_hash, fields_to_redact) if isinstance(v, dict) else v
                    for v in value
                ]
            else:
                result[key] = value
        return result

    def anonymize_list(self, data: list, fields_to_hash: list = None, fields_to_redact: list = None) -> list:
        """Anonymize a list of dictionaries"""
        return [self.anonymize_dict(item, fields_to_hash, fields_to_redact) if isinstance(item, dict) else item for item in data]


def anonymize_esg_data(data: dict) -> dict:
    """Convenience function"""
    anonymizer = DataAnonymizer()
    return anonymizer.anonymize_dict(data)