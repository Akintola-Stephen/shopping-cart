Imports Microsoft.AspNet.SignalR
Imports Microsoft.Owin
Imports Owin
<Assembly: OwinStartup(GetType(Interns_SignalR.Startup))> 
Namespace Interns_SignalR
    Public Class Startup
        Public Sub Configuration(app As IAppBuilder)
            app.MapSignalR()
        End Sub
    End Class
End Namespace

