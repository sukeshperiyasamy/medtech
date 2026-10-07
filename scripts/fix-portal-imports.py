import os

def fix_imports(folder):
    for root, dirs, files in os.walk(folder):
        for f in files:
            if f.endswith('.ts') or f.endswith('.tsx'):
                path = os.path.join(root, f)
                with open(path, 'r', encoding='utf-8') as file:
                    content = file.read()
                
                content = content.replace('from "@/types"', 'from "@/lib/portal/types"')
                content = content.replace("from '@/types'", "from '@/lib/portal/types'")
                content = content.replace('from "@/lib/google', 'from "@/lib/portal/google')
                content = content.replace("from '@/lib/google", "from '@/lib/portal/google")
                content = content.replace('from "@/lib/repositories', 'from "@/lib/portal/repositories')
                content = content.replace("from '@/lib/repositories", "from '@/lib/portal/repositories")
                content = content.replace('from "@/lib/utils"', 'from "@/lib/portal/utils"')
                content = content.replace("from '@/lib/utils'", 'from "@/lib/portal/utils"')
                content = content.replace('from "./store"', 'from "@/lib/portal/repositories/store"')
                content = content.replace("from './store'", 'from "@/lib/portal/repositories/store"')
                
                with open(path, 'w', encoding='utf-8') as file:
                    file.write(content)

if __name__ == "__main__":
    fix_imports("app/api")
    fix_imports("lib/portal")
    print("Done updating imports in app/api and lib/portal")
