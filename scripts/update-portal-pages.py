import os
import re

def update_portal_files():
    folder = "app/portal"
    
    replacements = [
        ('from "@/types"', 'from "@/lib/portal/types"'),
        ("from '@/types'", 'from "@/lib/portal/types"'),
        ('from "@/context/StudentContext"', 'from "@/components/portal/context/StudentContext"'),
        ("from '@/context/StudentContext'", 'from "@/components/portal/context/StudentContext"'),
        ('from "@/components/StudentHeaderCard"', 'from "@/components/portal/StudentHeaderCard"'),
        ("from '@/components/StudentHeaderCard'", 'from "@/components/portal/StudentHeaderCard"'),
        ('from "@/components/Navbar"', 'from "@/components/portal/Navbar"'),
        ("from '@/components/Navbar'", 'from "@/components/portal/Navbar"'),
        ('from "@/components/ui/', 'from "@/components/portal/ui/'),
        ("from '@/components/ui/", 'from "@/components/portal/ui/'),
        ('from "@/lib/utils"', 'from "@/lib/portal/utils"'),
        ("from '@/lib/utils'", 'from "@/lib/portal/utils"'),
        ('href="/dashboard"', 'href="/portal/dashboard"'),
        ('href="/profile"', 'href="/portal/profile"'),
        ('href="/publications"', 'href="/portal/publications"'),
        ('href="/patents"', 'href="/portal/patents"'),
        ('href="/projects"', 'href="/portal/projects"'),
        ('href="/internships"', 'href="/portal/internships"'),
        ('href="/achievements"', 'href="/portal/achievements"'),
        ('href="/conferences"', 'href="/portal/conferences"'),
        ('href="/startups"', 'href="/portal/startups"'),
        ('href="/documents"', 'href="/portal/documents"'),
        ('href="/admin"', 'href="/portal/admin"'),
        ('href="/"', 'href="/portal"'),
        ('href="/publications?action=add"', 'href="/portal/publications?action=add"'),
        ('href="/patents?action=add"', 'href="/portal/patents?action=add"'),
        ('href="/projects?action=add"', 'href="/portal/projects?action=add"'),
        ('href="/internships?action=add"', 'href="/portal/internships?action=add"'),
        ('href="/achievements?action=add"', 'href="/portal/achievements?action=add"'),
        ('href="/conferences?action=add"', 'href="/portal/conferences?action=add"'),
        ('href="/startups?action=add"', 'href="/portal/startups?action=add"'),
        ('href="/documents?action=add"', 'href="/portal/documents?action=add"'),
    ]

    for root, dirs, files in os.walk(folder):
        for f in files:
            if f.endswith(".tsx") or f.endswith(".ts"):
                path = os.path.join(root, f)
                with open(path, "r", encoding="utf-8") as file:
                    content = file.read()

                for src, dst in replacements:
                    content = content.replace(src, dst)

                content = re.sub(r'router\.push\((["\'])/dashboard(["\'])\)', r'router.push(\1/portal/dashboard\2)', content)
                content = re.sub(r'router\.push\((["\'])/profile(["\'])\)', r'router.push(\1/portal/profile\2)', content)
                content = re.sub(r'router\.push\((["\'])/(["\'])\)', r'router.push(\1/portal\2)', content)

                with open(path, "w", encoding="utf-8") as file:
                    file.write(content)

    print("Updated all app/portal pages successfully")

if __name__ == "__main__":
    update_portal_files()
