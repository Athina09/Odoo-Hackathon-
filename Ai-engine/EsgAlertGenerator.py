from datetime import datetime, timedelta
from logger import logger


class EsgAlertGenerator:
    """Generate compliance/sustainability alerts"""

    def __init__(self):
        self.alert_history = {}
        self.cooldown_minutes = 60
        logger.info("EsgAlertGenerator initialized")

    def check_and_alert(self, data: dict) -> list:
        """Check data and generate alerts if thresholds exceeded"""
        alerts = []
        
        # Carbon threshold alerts
        if "carbon" in data:
            carbon = data["carbon"]
            if isinstance(carbon, dict):
                tco2 = carbon.get("tco2", 0) or carbon.get("value", 0)
                if isinstance(tco2, str):
                    tco2 = int(''.join(filter(str.isdigit, tco2)))
                if tco2 > 100:
                    alerts.append(self._create_alert("carbon_threshold", "high", f"Carbon emissions at {tco2} tCO₂ exceeds threshold", data))
        
        # Department ESG score alerts
        if "departments" in data:
            for dept in data["departments"]:
                esg = dept.get("esg", 100)
                if esg < 70:
                    alerts.append(self._create_alert("low_esg_score", "high" if esg < 50 else "medium", 
                        f"Department {dept.get('department')} ESG score is {esg}", dept))
        
        # Facility status alerts
        if "facilities" in data:
            for fac in data["facilities"]:
                if fac.get("status") == "critical":
                    alerts.append(self._create_alert("critical_facility", "critical",
                        f"Facility {fac.get('name')} is in critical state", fac))
        
        # Compliance issues
        if "compliance_issues" in data:
            critical_count = sum(1 for i in data["compliance_issues"] if i.get("severity") == "critical")
            if critical_count > 0:
                alerts.append(self._create_alert("critical_compliance", "critical",
                    f"{critical_count} critical compliance issues detected", {"count": critical_count}))
        
        # Filter by cooldown
        filtered_alerts = []
        for alert in alerts:
            if not self._is_in_cooldown(alert["type"], alert.get("source_id", "default")):
                self._record_alert(alert["type"], alert.get("source_id", "default"))
                filtered_alerts.append(alert)
        
        return filtered_alerts

    def _create_alert(self, alert_type: str, severity: str, message: str, source: dict) -> dict:
        return {
            "id": f"ALT-{alert_type}-{int(datetime.utcnow().timestamp())}",
            "type": alert_type,
            "severity": severity,
            "message": message,
            "source": source,
            "timestamp": datetime.utcnow().isoformat(),
        }

    def _is_in_cooldown(self, alert_type: str, source_id: str) -> bool:
        key = f"{alert_type}:{source_id}"
        if key not in self.alert_history:
            return False
        last_time = self.alert_history[key]
        return datetime.utcnow() - last_time < timedelta(minutes=self.cooldown_minutes)

    def _record_alert(self, alert_type: str, source_id: str):
        key = f"{alert_type}:{source_id}"
        self.alert_history[key] = datetime.utcnow()

    def generate_summary_alert(self, summary: dict) -> dict:
        """Generate a summary alert from ESG summary data"""
        alert_count = sum(1 for v in summary.values() if isinstance(v, (int, float)) and v > 70)
        return self._create_alert("esg_summary", "info" if alert_count == 0 else "warning",
            f"ESG Summary: {alert_count} areas need attention", summary)


def generate_esg_alerts(data: dict) -> list:
    """Convenience function"""
    generator = EsgAlertGenerator()
    return generator.check_and_alert(data)